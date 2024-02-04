import { NextApiRequest } from 'next';
import chatMessage from '@/models/ChatMessage';
import { NextResponse } from 'next/server';
import {decryptMessage} from "@/utils/hashedSecurity";

// Define the API route
export async function GET(req: NextApiRequest) {
  try {
    // Find all disliked answers where likeDislike is false
    const dislikedAnswers = await chatMessage.find({ likeDislike: false });

    // Prepare the data for download
    const report = dislikedAnswers.map((answer: { question: any; answer: any }) => ({
      question: decryptMessage(answer.question),
      answer: decryptMessage(answer.answer),
      // ... other relevant fields
    }));

    // Convert the data to CSV format

const csvData =
      'Inadequately Addressed Inquiries\n' +
      '\n' +
      report.map(
        (item) =>
          `Question: ${item.question}\nAnswer: ${item.answer}`
      ).join('\n\n');
    console.log(" CSV DATA " , csvData);

    // Set the response headers for CSV data
    return NextResponse.json({
      body: csvData,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=disliked_answers.csv',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching disliked answers:', error);

    return NextResponse.json({
      body: { error: 'Internal Server Error' },
      status: 500,
    });
  }
}