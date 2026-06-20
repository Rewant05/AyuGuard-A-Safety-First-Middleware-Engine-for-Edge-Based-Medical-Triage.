import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { patientId, spo2, heartRate, temperatureC, respiratoryRate, systolicBp, diastolicBp, glucoseMgDl } = body;

    if (!patientId) {
      return NextResponse.json({ error: "Missing patientId" }, { status: 400 });
    }

    const reading = await prisma.vitalsReading.create({
      data: {
        patientId,
        spo2,
        heartRate,
        temperatureC,
        respiratoryRate,
        systolicBp,
        diastolicBp,
        glucoseMgDl,
      },
    });

    return NextResponse.json(reading);
  } catch (error) {
    return NextResponse.json({ error: "Failed to save vitals reading" }, { status: 500 });
  }
}
