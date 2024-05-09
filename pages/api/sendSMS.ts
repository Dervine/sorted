import { NextApiRequest, NextApiResponse } from 'next';
import AfricasTalking from 'africastalking';

const APIKey = process.env.API_KEY as string;
const APIUsername = process.env.USERNAME as string;
const senderID = process.env.SENDER_ID as string;

const africastalking = AfricasTalking({
  apiKey: APIKey,
  username: APIUsername
});

const sendSMS = async (phoneNumber: string, message: string): Promise<boolean> => {
  try {
    const result = await africastalking.SMS.send({
      to: phoneNumber,
      message: message,
      from: senderID
    });
    console.log(result);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default async function sendSMSHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { phoneNumber, message } = req.body;
    const sent = await sendSMS(phoneNumber, message);
    if (sent) {
      res.status(200).json({ success: true, message: 'SMS sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send SMS' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}
