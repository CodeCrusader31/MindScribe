import { ConnectDB } from "@/lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      await ConnectDB();
      res.status(200).json({ message: "✅ MongoDB Connected Successfully" });
      console.log("DB Connected");
    } catch (error) {
      res.status(500).json({ error: "❌ MongoDB Connection Failed" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
