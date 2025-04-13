import { ConnectDB } from "@/lib/config/db";
import { NextResponse } from "next/server";
import EmailModel from "@/lib/models/emailModel";

const LoadDB = async()=>{
    await ConnectDB();
}
LoadDB();

export async function POST(request) {
    const formData = await request.formData();
    const emailData = {
        email:`${formData.get("email")}`,
    }
    await EmailModel.create(emailData);
    return NextResponse.json({success:true, msg:"Email Subscribed!"});
}

export async function GET(request) {
    try {
     // Connect to DB before querying
      const emails = await EmailModel.find({}); // await the query
      return NextResponse.json({ emails });
    } catch (error) {
      console.error('Error fetching emails:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }
  
  export async function DELETE(request) {
    const mongoId = request.nextUrl.searchParams.get("id"); // ✅ don't destructure
    await EmailModel.findByIdAndDelete(mongoId);
    return NextResponse.json({ success: true, msg: "Email Deleted!" }); 
}
