import { getAuthenticatedUser, parseDateToUTC } from '../utils/constants';
import toast from 'react-hot-toast';
import BSON from 'bson';
import AWS from 'aws-sdk';
import { FormData } from '../features/profile/CompanyInfo';

async function createUser(userData: object) {
  try {
    const user = await getAuthenticatedUser();
    const mongodb = user.mongoClient('mongodb-atlas');
    const usersCollection = mongodb.db('user-account').collection('Contacts');
    const doctorCollection = mongodb.db('user-account').collection('Doctors');

    const doctor = await doctorCollection.findOne();
    const doctors = doctor._id.toString();

    userData = {
      ...userData,
      doctor: doctors,
    };

    const newUser = await usersCollection.insertOne(userData);
    console.log('User created successfully:', userData);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error('Failed to create user');
  }
}

async function searchUser(searchQuery: string) {
  try {
    const user = await getAuthenticatedUser();
    const mongodb = user.mongoClient('mongodb-atlas');
    const usersCollection = mongodb.db('user-account').collection('Contacts');
    const pattern = searchQuery;

    const result = await usersCollection.find({
      name: { $regex: pattern, $options: 'i' },
    });

    return result;
  } catch (error) {
    console.error('Error searching user:', error);
    // toast.error('Failed to search user');
    throw error;
  }
}

async function searchDoctors(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const mongodb = user.mongoClient('mongodb-atlas');
    const usersCollection = mongodb.db('user-account').collection('Doctors');
    const pattern = id;

    const result = await usersCollection.find({ loginKey: pattern });

    return result;
  } catch (error) {
    console.error('Error searching doctors:', error);
    // toast.error('Failed to search doctors');
    throw error;
  }
}
async function displayContacts(limit: number, offset: number) {
  try {
    const user = await getAuthenticatedUser();
    const mongodb = user.mongoClient('mongodb-atlas');
    const contactsCollection = mongodb
      .db('user-account')
      .collection('Contacts');

    try {
      const page = offset;
      const pageSize = limit;

      const skips = (page - 1) * pageSize;
      console.log(skips);

      const pipeline = [{ $skip: skips }, { $limit: pageSize }];

      const contacts = await contactsCollection.aggregate(pipeline);

      console.log('Contact:', contacts);
      return contacts;
    } catch (error) {
      toast.error('Failed to Fetch Contacts');
      console.error('Error while performing fetch Contacts', error);
      throw error;
    }
  } catch (error) {
    toast.error('Failed to Connect Database');
    console.error('Error while performing display function:', error);
    throw error;
  }
}

//create Slot

async function createSlot(
  slotNo: number,
  slotTime: string,
  maxPeople: number,
  date: string
) {
  const user = await getAuthenticatedUser();
  const currentDate = new Date();

  const dateString = date;

  const parsedDate = parseDateToUTC(dateString);
  console.log(parsedDate);
  // let isoString = parsedDate.toISOString();

  console.log('😂😂😂😂', parsedDate);

  const slotDocument = {
    slotNo: slotNo,
    date: parsedDate,
    createdAt: currentDate,
    updatedAt: currentDate,
    slotTime: slotTime,
    maxPeople: maxPeople,
    isDeleted: false,
  };
  console.log(slotDocument);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const usersCollection = mongodb.db('user-account').collection('Slots');
    await usersCollection.insertOne(slotDocument);
    toast.success('Slot created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

//display slots
async function displaySlots(date: string) {
  try {
    const user = await getAuthenticatedUser();
    console.log('⭐⭐⭐⭐⭐⭐⭐⭐', user);
    const mongodb = user.mongoClient('mongodb-atlas');
    const slotCollection = mongodb.db('user-account').collection('Slots');

    const dateString = date;

    const parsedDate = parseDateToUTC(dateString);
    console.log(parsedDate);

    try {
      const result = await slotCollection.find({ date: parsedDate });
      return result;
    } catch (error) {
      console.error('Error while fetching slots collections:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error while performing displaySlots function :', error);
    throw error;
  }
}
//edit slots
async function editSlots(id: string, newMaxPeople: number) {
  try {
    const user = await getAuthenticatedUser();
    const mongodb = user.mongoClient('mongodb-atlas');
    const slotCollection = mongodb.db('user-account').collection('Slots');

    const objectId = new BSON.ObjectId(id);
    try {
      const result = await slotCollection.findOne({ _id: objectId });

      if (!result) {
        throw new Error('Slot not found.');
      }

      await slotCollection.updateOne(
        { _id: objectId },
        { $set: { maxPeople: newMaxPeople, updatedAt: new Date() } }
      );
    } catch (error) {
      console.error('Error while fetching slots collections:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error while performing displaySlots function :', error);
    throw error;
  }
}
//delete slot
async function deleteSlot(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const mongodb = user.mongoClient('mongodb-atlas');
    const slotCollection = mongodb.db('user-account').collection('Slots');

    const objectId = new BSON.ObjectId(id);

    try {
      const result = await slotCollection.findOne({ _id: objectId });

      if (!result) {
        toast.error('Slot not found');
        return;
      }

      const slotDate = result.date;
      console.log('Slot Date: 2024-06-15T00:00:00.000+00:00 == :', slotDate);
      const deletedSlotNo = result.slotNo;

      const deleteResult = await slotCollection.deleteOne({ _id: objectId });

      if (deleteResult.deletedCount === 1) {
        toast.success('Slot deleted successfully.');
      } else {
        toast.error('Slot not deleted.');
      }

      const remainingSlots = await slotCollection.find({ date: slotDate });

      console.log(remainingSlots);

      for (const slot of remainingSlots) {
        if (slot.slotNo > deletedSlotNo) {
          const newSlotNo = slot.slotNo - 1;
          await slotCollection.updateOne(
            { _id: slot._id },
            { $set: { slotNo: newSlotNo } }
          );
        }
      }
    } catch (error) {
      console.error('Error while fetching slots collections:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error while performing deleteSlot function:', error);
    throw error;
  }
}

//Send slots

async function sendSlots(startOfWeek: string, endOfWeek: string) {
  const user = await getAuthenticatedUser();
  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const slotsCollection = mongodb.db('user-account').collection('Slots');

    const dateString1 = startOfWeek;
    const dateString2 = endOfWeek;

    const parsedDate1 = parseDateToUTC(dateString1);
    const parsedDate2 = parseDateToUTC(dateString2);

    const query = {
      date: {
        $gte: parsedDate1,
        $lte: parsedDate2,
      },
    };

    const documents = await slotsCollection.find(query);

    // console.log(documents);

    const transformedResult = documents.reduce((result, currentItem) => {
      const { date } = currentItem;

      const dateString = date.toISOString().split('T')[0];

      if (!result[dateString]) {
        result[dateString] = [];
      }

      result[dateString].push(currentItem);

      return result;
    }, {});
    console.log(transformedResult);

    return transformedResult;
  } catch (error) {
    console.log('Error while creating a appopintment : ', error);
  }
}

async function getAppointment(result: string) {
  const user = await getAuthenticatedUser();
  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const appointmentCollection = mongodb
      .db('user-account')
      .collection('appointmetnt');

    if (result === 'upcoming') {
      const appointments = await appointmentCollection.find({
        isCompleted: false,
        isDeleted: false,
      });
      console.log('Appointments:', appointments);
      return appointments;
    }

    if (result === 'past') {
      const appointments = await appointmentCollection.find({
        isCompleted: true,
        isDeleted: false,
      });
      console.log('Appointments:', appointments);
      return appointments;
    }
  } catch (error) {
    console.error('Error while fetching appointments:', error);
  }
}

async function updateAppointment(Id: string, value: string) {
  const user = await getAuthenticatedUser();

  const Appointment_objectId = new BSON.ObjectId(Id);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const appointmentCollection = mongodb
      .db('user-account')
      .collection('appointmetnt');

    const appointment = await appointmentCollection.findOne({
      _id: Appointment_objectId,
    });

    if (!appointment) {
      return;
    }

    if (value === 'complete') {
      await appointmentCollection.updateOne(
        { _id: Appointment_objectId },
        { $set: { isCompleted: true } }
      );
      toast.success('Marked as completed..');
    }

    if (value === 'delete') {
      await appointmentCollection.updateOne(
        { _id: Appointment_objectId },
        { $set: { isDeleted: true } }
      );
      toast.success('Deleted succesfully...');
    }
  } catch (err) {
    console.log(err);
  }
}

async function createAppointment(
  selected_SLOT_NO: number,
  selected_Date: string,
  CId: string,
  comments: string
) {
  const user = await getAuthenticatedUser();

  const Contact_objectId = new BSON.ObjectId(CId);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const appointmentCollection = mongodb
      .db('user-account')
      .collection('appointmetnt');
    const contactCollection = mongodb.db('user-account').collection('Contacts');
    const SlotsCollection = mongodb.db('user-account').collection('Slots');

    const userData = await contactCollection.findOne({ _id: Contact_objectId });

    console.log('🔥🔥🔥🔥🔥', userData);

    console.log(userData.name);
    console.log(userData.phone);

    const dateString = selected_Date;

    const parsedDate = parseDateToUTC(dateString);

    const { maxPeople } = await SlotsCollection.findOne({
      slotNo: selected_SLOT_NO,
      date: parsedDate,
    });

    if (!maxPeople) {
      console.log('Slot not found');
      return;
    }

    const existingAppointments = await appointmentCollection.count({
      slotNo: selected_SLOT_NO,
      date: parsedDate,
    });

    if (existingAppointments >= maxPeople) {
      toast.error(
        'Appointment limit reached for this slot. Please select another slot.'
      );
      return;
    }

    const latestAppointment = await appointmentCollection.findOne(
      {
        slotNo: selected_SLOT_NO,
        date: parsedDate,
      },
      { sort: { token: -1 } }
    );

    const token = latestAppointment ? latestAppointment.token + 1 : 1;

    const Appointment = {
      token: token,
      date: parsedDate,
      contactId: Contact_objectId,
      name: userData.name,
      phone: userData.phone,
      slotNo: selected_SLOT_NO,
      comment: comments || '',
      isDeleted: false,
      isCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const appointment = await appointmentCollection.insertOne(Appointment);
    console.log('Appointment created:', appointment);
    return appointment;
  } catch (error) {
    console.log('Error while creating an appointment: ', error);
  }
}

async function fetchContactById(CID: string) {
  const user = await getAuthenticatedUser();

  const contact_id = new BSON.ObjectId(CID);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const contactCollection = mongodb.db('user-account').collection('Contacts');

    const contact = await contactCollection.findOne({ _id: contact_id });

    console.log('Contact:', contact);

    return contact;
  } catch (error) {
    console.error('Error while performing fetching contact by id:', error);
    throw error;
  }
}
//upi
async function updateDoctor(Id: string, UPI: string, value: string) {
  const user = await getAuthenticatedUser();

  if (!user) {
    console.log('No user logged in');
    return;
  }

  const doctor_id = new BSON.ObjectId(Id);
  console.log(doctor_id);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const doctorCollection = mongodb.db('user-account').collection('Doctors');

    if (value === 'update') {
      const doctor = await doctorCollection.findOne({
        _id: doctor_id,
        upiId: UPI,
      });
      if (doctor) {
        console.log('UPI already exists in the array');
        return;
      }

      const updateResult = await doctorCollection.updateOne(
        { _id: doctor_id },
        { $push: { upiId: UPI } }
      );

      console.log('Added succesfully', updateResult);
    }

    if (value === 'delete') {
      const doctor = await doctorCollection.findOne({
        _id: new BSON.ObjectId(doctor_id),
        upiId: UPI,
      });
      if (doctor) {
        console.log('UPI exists in the array');
        const updateResult = await doctorCollection.updateOne(
          { _id: doctor_id },
          { $pull: { upiId: UPI } }
        );
        console.log('Deleted succesfully', updateResult);
      } else {
        console.log('UPI does not exists in the array');
      }
    }
  } catch (err) {
    console.log('Error while adding UPI ', err);
  }
}

async function editContact(Id: string, obj: { name: string; phone: string }) {
  const user = await getAuthenticatedUser();

  const Contact_objectId = new BSON.ObjectId(Id);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const contactCollection = mongodb.db('user-account').collection('Contacts');
    const appointementCollection = mongodb
      .db('user-account')
      .collection('appointmetnt');

    if (!obj) {
      console.log('empty object....🚀🚀🚀🚀🚀');
      return;
    }

    const { name, phone } = obj;

    const userData = await contactCollection.findOneAndUpdate(
      { _id: Contact_objectId },
      { $set: obj }
    );
    if (userData) {
      toast.success('Contact updated successfully');
    }
    console.log('userData', userData);

    const userDatas = await contactCollection.findOne({
      _id: Contact_objectId,
    });
    console.log('userDatas', userDatas);

    const appointmentData = await appointementCollection.updateMany(
      { contactId: Contact_objectId },
      {
        $set: { name, phone },
      }
    );

    console.log(appointmentData);
  } catch (err) {
    console.log(err);
  }
}
async function getUpcomingAppById(Id: string) {
  const user = await getAuthenticatedUser();
  function formatDateToYYYYMMDD(dateString: Date) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const appointmentCollection = mongodb
      .db('user-account')
      .collection('appointmetnt');

    const appointments = await appointmentCollection.findOne({
      _id: new BSON.ObjectId(Id),
      isCompleted: false,
      isDeleted: false,
    });

    const formatedDate = formatDateToYYYYMMDD(appointments.date);

    console.log('⭐⭐⭐⭐', formatedDate);
    appointments.date = formatedDate;

    console.log('Appointments:', appointments);
    // console.log('Appointments:', appointments);

    return appointments;
  } catch (error) {
    console.error('Error while fetching appointments by Id:', error);
  }
}
interface Slot {
  _id: string;
  id: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  maxPeople: number;
  people: number;
  slotNo: number;
  slotTime: string;
  time: string;
}
export interface LastSlot {
  _id: string;
  date?: Date;
  slotTime: string;
  [key: string]: unknown;
}

interface LastWeekSlots {
  [key: string]: LastSlot[];
}
async function copyFromLastWeek(targetDate: Date) {
  const parsedDate = targetDate;
  console.log('Parsed target date:', parsedDate);

  const startOfLastWeek = new Date(parsedDate);
  startOfLastWeek.setDate(parsedDate.getDate() - 7);
  startOfLastWeek.setHours(0, 0, 0, 0);

  const endOfLastWeek = new Date(parsedDate);
  endOfLastWeek.setDate(parsedDate.getDate() - 1);
  endOfLastWeek.setHours(23, 59, 59, 999);
  const startOfLastWeekString = startOfLastWeek
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, ' ');

  const endOfLastWeekString = endOfLastWeek
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .replace(/ /g, ' ');

  console.log(
    'Fetching data from:',
    startOfLastWeekString,
    'to',
    endOfLastWeekString
  );

  try {
    const lastWeekSlots: LastWeekSlots = await sendSlots(
      startOfLastWeekString,
      endOfLastWeekString
    );
    const count = Object.keys(lastWeekSlots).length;
    console.log('Number of slots from last week:', count);

    if (count === 0) {
      toast.error('No slots found from last week');
      return;
    }

    const updatedLastWeekSlots = Object.entries(lastWeekSlots).reduce(
      (acc: LastWeekSlots, [key, values]: [string, LastSlot[]]) => {
        const dateForKey = new Date(key);
        dateForKey.setDate(dateForKey.getDate() + 7);
        const newKey = dateForKey.toISOString().split('T')[0];

        const newValues = values.map((value: LastSlot) => {
          const { _id, ...rest } = value; // Exclude _id from value
          console.log(_id);

          if (rest.date) {
            const dateForValue = new Date(rest.date);
            dateForValue.setDate(dateForValue.getDate() + 7);
            rest.date = dateForValue; // Convert the date back to string format
          }
          return rest as LastSlot; // Cast the value to LastSlot type
        });

        acc[newKey] = newValues;
        return acc;
      },
      {} as LastWeekSlots
    );
    return updatedLastWeekSlots;
  } catch (error) {
    console.error('Error copying slots from last week:', error);
  }
}

export async function insert_Slot_Copy_LastWeek(Documents: object) {
  const user = await getAuthenticatedUser();

  if (!user) {
    console.log('No user logged in');
    return;
  }

  const mongodb = user.mongoClient('mongodb-atlas');
  const slotCollection = mongodb.db('user-account').collection('Slots');

  const allObjectsArray = Object.values(Documents).flat();
  const insertedData = await slotCollection.insertMany(allObjectsArray);

  console.log(allObjectsArray);
  console.log(insertedData);
}

//copy from yesterday
async function copyFromYesterday(targetDate: string) {
  const user = await getAuthenticatedUser();
  const mongodb = user.mongoClient('mongodb-atlas');
  const slotsCollection = mongodb.db('user-account').collection('Slots');

  const parsedDate = parseDateToUTC(targetDate);
  console.log('Parsed target date:', parsedDate);

  const previousDay = new Date(parsedDate);
  previousDay.setDate(parsedDate.getDate() - 1);
  console.log('Fetching date:', previousDay);

  try {
    const previousDaySlotsCursor = slotsCollection.find({
      date: {
        $gte: new Date(previousDay.setHours(0, 0, 0, 0)),
        $lt: new Date(parsedDate.setHours(0, 0, 0, 0)),
      },
    });

    const previousDaySlots = await previousDaySlotsCursor;
    console.log('Slots from previous day:', previousDaySlots);
    console.log('Number of slots from previous day:', previousDaySlots.length);

    if (previousDaySlots.length === 0) {
      console.log('No slots found from the previous day');
      return [];
    }

    return previousDaySlots;
  } catch (error) {
    console.error('Error fetching slots from the previous day:', error);
    return [];
  }
}

async function newInsert(targetDate: string, slotsAfterDeletion: [object]) {
  const user = await getAuthenticatedUser();
  const mongodb = user.mongoClient('mongodb-atlas');
  const slotsCollection = mongodb.db('user-account').collection('Slots');
  console.log('hello........................', slotsAfterDeletion);
  const parsedDate = parseDateToUTC(targetDate);
  console.log('Parsed target date:', parsedDate);
  const currentDate = new Date();
  try {
    const newSlots: object[] = [];

    slotsAfterDeletion.forEach((slot: object) => {
      const typedSlot: Slot = slot as Slot;
      // Rest of the code
      newSlots.push({
        slotNo: typedSlot.id,
        date: parsedDate,
        createdAt: currentDate,
        updatedAt: currentDate,
        slotTime: typedSlot.time,
        maxPeople: typedSlot.people,
        isDeleted: false,
      });
    });

    console.log('New slots:..................', newSlots);

    if (newSlots.length > 0) {
      await slotsCollection.insertMany(newSlots);
      toast.success('Slots inserted from the previous day successfully');
      return newSlots;
    } else {
      toast.error('No new slots to insert');
      return [];
    }
  } catch (error) {
    console.error('Error inserting new slots:', error);
    return [];
  }
}

//copy from last week of slots
async function copyOneFromLastWeek(targetDate: string) {
  const user = await getAuthenticatedUser();
  const mongodb = user.mongoClient('mongodb-atlas');
  const slotsCollection = mongodb.db('user-account').collection('Slots');

  const parsedDate = parseDateToUTC(targetDate);
  console.log('Parsed target date:', parsedDate);

  const seventhDayBack = new Date(parsedDate);
  seventhDayBack.setDate(parsedDate.getDate() - 7);
  console.log('Fetching date:', seventhDayBack);

  try {
    const previousDaySlotsCursor = slotsCollection.find({
      date: {
        $gte: new Date(seventhDayBack.setHours(0, 0, 0, 0)),
        $lt: new Date(seventhDayBack.setHours(23, 59, 59, 999)),
      },
    });

    const previousDaySlots = await previousDaySlotsCursor;
    console.log('Slots from the seventh day back:', previousDaySlots);
    console.log(
      'Number of slots from the seventh day back:',
      previousDaySlots.length
    );
    toast.success('Slots copied from the last week successfully');
    return previousDaySlots;
    if (previousDaySlots.length === 0) {
      toast.error('No slots found from the last week');
      return [];
    }
  } catch (error) {
    console.error('Error copying slots from the seventh day back:', error);
  }
}
//edit Appointment by Slot No
async function edit_App_Slot_No(AID: string, UpdSlotNo: number, value: string) {
  const user = await getAuthenticatedUser();

  const Appointment_objectId = new BSON.ObjectId(AID);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const appointmentCollection = mongodb
      .db('user-account')
      .collection('appointmetnt');
    const appointment = await appointmentCollection.findOne({
      _id: Appointment_objectId,
    });

    if (!appointment) {
      console.log('There is no appointment for the given Id');
      return;
    }

    if (appointment.isCompleted) {
      console.log("Can't update the appointment as once it is completed");
      return;
    }

    const { slotNo, token, date, comment } = appointment;
    console.log('⭐', slotNo, token, date);

    if (slotNo === UpdSlotNo) {
      if (comment === value) {
        toast.error('There is no changes.. to update');
        return;
      }

      const finalUpdate = await appointmentCollection.findOneAndUpdate(
        { _id: Appointment_objectId },
        {
          $set: { comment: value },
        }
      );
      toast.success('Appointment updated successfully');

      if (!finalUpdate) {
        toast.error('Comment update failed...');
      }
      return true;
    }

    const query = {
      date: date,
      slotNo: slotNo,
      token: { $gt: token },
    };

    const update = {
      $inc: {
        token: -1,
      },
      $set: {
        updatedAt: new Date(),
      },
    };

    try {
      const updateResult = await appointmentCollection.updateMany(
        query,
        update
      );

      if (updateResult.matchedCount === 0) {
        console.log(
          'There is no token greater then current token... or only had one token'
        );
      } else {
        console.log(
          `${updateResult.modifiedCount} documents were updated (decremented by 1)`
        );
      }
    } catch (err) {
      console.log('Error while updating Appointment by Slot No  ⭐⭐ ', err);
    }

    console.log(UpdSlotNo);

    const query2 = {
      date: date,
      slotNo: UpdSlotNo,
    };

    const appointments = await appointmentCollection.find(query2);
    console.log('🧨🧨🧨', appointments);

    if (appointments.length === 0) {
      // console.log('No slots found for the given date and updated slot number');
      const finalUpdate = await appointmentCollection.findOneAndUpdate(
        { _id: Appointment_objectId },
        {
          $set: {
            slotNo: UpdSlotNo,
            token: 1,
            comment: value,
            updatedAt: new Date(),
          },
        }
      );
      console.log(' Token and Slot updated successfully ⭐⭐⭐', finalUpdate);
      toast.success('Appointment updated successfully');
      return true;
    }

    const arr = appointments.map((obj) => obj.token);

    const greatestToken = Math.max(...arr);
    console.log(arr, greatestToken);

    if (appointments.length > 0) {
      const finalUpdate = await appointmentCollection.findOneAndUpdate(
        { _id: Appointment_objectId },
        {
          $set: {
            slotNo: UpdSlotNo,
            token: greatestToken + 1,
            comment: value,
            updatedAt: new Date(),
          },
        }
      );
      toast.success('Appointment updated successfully');
      console.log(' Token and Slot updated successfully ⭐⭐⭐', finalUpdate);
      return true;
    } else {
      toast.error('No slots found for the given date and updated slot number');
      console.log('No slots found for the given date and slot number');
    }
  } catch (err) {
    console.log('Error while updating Appointment by Slot No ', err);
  }
}
async function deleteAppoitment(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const mongodb = user.mongoClient('mongodb-atlas');
    const appoitmentCollection = mongodb
      .db('user-account')
      .collection('appointmetnt');

    const objectId = new BSON.ObjectId(id);
    const result = await appoitmentCollection.findOne({ _id: objectId });

    if (!result) {
      toast.error('Appoitment not found');
      return;
    }
    console.log('Appoitment:', result);

    result.isDeleted = true;
    const updateResult = await appoitmentCollection.updateOne(
      { _id: objectId },
      { $set: { isDeleted: true } }
    );
    if (updateResult.modifiedCount === 1) {
      toast.success('Appoitment deleted successfully.');
    }
  } catch (error) {
    console.error('Error while performing deleteAppoitment function:', error);
    throw error;
  }
}
//ChatPage

async function pre_Signed_Url(key: string) {
  AWS.config.update({
    accessKeyId: 'AKIA6GBMGVWQAJKZSNOH',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });

  const s3 = new AWS.S3();
  const params = {
    Bucket: 'manishexelon',
    Key: key,
    Expires: 60,
  };

  try {
    const uploadUrl = await s3.getSignedUrlPromise('putObject', params);
    return uploadUrl;
  } catch (error) {
    console.error('Error generating pre-signed URL', error);
    throw error;
  }
}

async function uploadChats(
  data: string,
  type: string,
  key: string,
  DID: string,
  CID: string
) {
  const user = await getAuthenticatedUser();
  const mongodb = user.mongoClient('mongodb-atlas');
  const chatCollection = mongodb.db('user-account').collection('Chat');

  const Doctor_objectId = new BSON.ObjectId(DID);
  const Contact_objectId = new BSON.ObjectId(CID);

  console.log('🎉🎉🎉🎉', data);
  console.log(key);

  const file = [];
  const audio = [];
  const image = [];
  let message = null;

  console.log('⭐⭐⭐⭐', type);

  if (type === 'text') {
    message = data;
  }

  if (type === 'image') {
    image.push(key);
  }

  if (type === 'audio') {
    audio.push(key);
  }

  if (type === 'file') {
    file.push(key);
  }

  try {
    const document = {
      message,
      file: file,
      audio: audio,
      image: image,
      createdAt: new Date(),
      updatedAt: new Date(),
      doctor_id: Doctor_objectId,
      contact_id: Contact_objectId,
    };
    const result = await chatCollection.insertOne(document);

    console.log(result);
  } catch (err) {
    console.log(err);
  }
}
async function uploadFile(file: File, type: string, DID: string, CID: string) {
  const key = file.name;
  const bucketName = 'manishexelon';
  const region = 'ap-south-1';

  try {
    const uploadUrl = await pre_Signed_Url(key);
    console.log(uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (response.ok) {
      const storeURL = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
      console.log(storeURL);
      await uploadChats(storeURL, type, key, DID, CID); // Function to store in the database
      console.log('File uploaded and stored successfully');
    } else {
      console.error('File upload failed');
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

async function display_pre_Signed_Url(key: string) {
  AWS.config.update({
    accessKeyId: 'AKIA6GBMGVWQAJKZSNOH',
    secretAccessKey: '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',
    region: 'ap-south-1',
  });

  const s3 = new AWS.S3();
  const params = {
    Bucket: 'manishexelon',
    Key: key,
    Expires: 3600,
  };

  try {
    const downloadUrl = await s3.getSignedUrlPromise('getObject', params);
    return downloadUrl;
  } catch (error) {
    console.error('Error generating pre-signed URL', error);
    throw error;
  }
}
interface ChatDocument {
  message?: string;
  audio?: string;
  file?: string;
  image?: string;
  createdAt?: Date;
  filetype?: string;
  filename?: string;
}
async function displayChats(
  LIMIT: number,
  PAGE: number,
  DID: string,
  CID: string
) {
  const user = await getAuthenticatedUser();
  const mongodb = user.mongoClient('mongodb-atlas');
  const chatCollection = mongodb.db('user-account').collection('Chat');

  try {
    const page = PAGE || 1; // Adjusted to start from page 1
    const pageSize = LIMIT || 10; // Adjusted default page size to 10

    const skips = (page - 1) * pageSize;

    const pipeline = [
      {
        $match: {
          doctor_id: new BSON.ObjectId(DID),
          contact_id: new BSON.ObjectId(CID),
        },
      },
      { $sort: { createdAt: -1 } }, // Sort by createdAt descending
      { $skip: skips },
      { $limit: pageSize },
    ];

    const result = await chatCollection.aggregate(pipeline);

    const filteredDocuments = await Promise.all(
      result.map(async (doc: ChatDocument) => {
        const filteredDoc: ChatDocument = {};

        if (doc.message && doc.message.trim() !== '') {
          filteredDoc.filetype = 'txt';
          filteredDoc.message = doc.message;
          filteredDoc.createdAt = doc.createdAt;
        }

        if (doc.audio && doc.audio.length > 0) {
          const extension = doc.audio[0].split('.').pop();
          filteredDoc.filetype = extension;
          filteredDoc.filename = doc.audio[0];
          filteredDoc.audio = await display_pre_Signed_Url(doc.audio[0]);
          filteredDoc.createdAt = doc.createdAt;
        }

        if (doc.file && doc.file.length > 0) {
          const extension = doc.file[0].split('.').pop();
          if (extension === 'webm') {
            filteredDoc.filetype = 'video';
          } else {
            filteredDoc.filetype = 'file';
          }
          filteredDoc.filename = doc.file[0];
          filteredDoc.file = await display_pre_Signed_Url(doc.file[0]);
          filteredDoc.createdAt = doc.createdAt;
        }

        if (doc.image && doc.image.length > 0) {
          const extension = doc.image[0].split('.').pop();
          filteredDoc.filetype = extension;
          filteredDoc.filename = doc.image[0];
          filteredDoc.image = await display_pre_Signed_Url(doc.image[0]);
          filteredDoc.createdAt = doc.createdAt;
        }

        return filteredDoc;
      })
    ).then((filteredDocs) =>
      filteredDocs.filter((doc) => Object.keys(doc).length > 0)
    );

    console.log(filteredDocuments);

    return filteredDocuments;
  } catch (err) {
    console.log(err);
  }
}

async function uploadProfile(id: string, file: File, type: string) {
  console.log(type);
  const key = file.name;
  // const bucketName = 'manishexelon';
  // const region = 'ap-south-1';

  try {
    const uploadUrl = await pre_Signed_Url(key);
    console.log(uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (response.ok) {
      const storeURL = await display_pre_Signed_Url(key);

      console.log('🚀🚀🚀🚀🚀', storeURL);

      await profileChange(id, storeURL);
      console.log('File uploaded and stored successfully');
      return true;
    } else {
      console.error('File upload failed');
      return false;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}
async function profileChange(Id: string, URL: string) {
  const user = await getAuthenticatedUser();

  if (!user) {
    console.log('No user logged in');
    return;
  }

  const doctor_id = new BSON.ObjectId(Id);

  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const doctorCollection = mongodb.db('user-account').collection('Doctors');

    const doctor = await doctorCollection.findOneAndUpdate(
      { _id: doctor_id },
      {
        $set: { profile: URL },
      }
    );
    console.log(doctor);
  } catch (err) {
    console.log(err);
  }
}
async function updateCompanyInfo(Id: string, formData: FormData) {
  const user = await getAuthenticatedUser();

  if (!user) {
    console.log('No user logged in');
    return;
  }

  const doctor_id = new BSON.ObjectId(Id);
  console.log(doctor_id);

  const {
    city,
    companyName,
    phone,
    pinCode,
    companyAddress: { line1, line2 },
  } = formData;

  const companyInfo = {
    companyAddress: {
      line1: line1,
      line2: line2,
      city: city,
      pinCode: pinCode,
    },
    companyName: companyName,
    mobile: phone,
  };
  try {
    const mongodb = user.mongoClient('mongodb-atlas');
    const doctorCollection = mongodb.db('user-account').collection('Doctors');

    const updateResult = await doctorCollection.updateOne(
      { _id: doctor_id },
      { $set: companyInfo }
    );
    toast.success('Company information updated successfully');
    console.log('Added succesfully', updateResult);
  } catch (err) {
    console.log('Error while adding UPI ', err);
  }
}

export {
  createUser,
  searchUser,
  searchDoctors,
  displayContacts,
  createSlot,
  displaySlots,
  getAppointment,
  updateDoctor,
  deleteSlot,
  editSlots,
  sendSlots,
  updateAppointment,
  createAppointment,
  fetchContactById,
  editContact,
  getUpcomingAppById,
  edit_App_Slot_No,
  copyFromLastWeek,
  copyFromYesterday,
  copyOneFromLastWeek,
  deleteAppoitment,
  pre_Signed_Url,
  displayChats,
  display_pre_Signed_Url,
  uploadChats,
  uploadFile,
  newInsert,
  uploadProfile,
  profileChange,
  updateCompanyInfo,
};
