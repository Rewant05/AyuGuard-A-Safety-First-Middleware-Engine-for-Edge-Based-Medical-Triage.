import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        readings: {
          orderBy: { timestamp: "asc" },
          take: 50,
        },
      },
    });
    return NextResponse.json(patients);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, age, gender, village } = body;
    
    if (!name || !age || !gender || !village) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPatient = await prisma.patient.create({
      data: {
        name,
        age: parseInt(age),
        gender,
        village
      }
    });

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Failed to create patient:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
