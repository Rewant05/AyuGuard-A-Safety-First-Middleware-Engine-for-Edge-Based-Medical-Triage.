import { PrismaClient } from '@prisma/client'
import { samplePatients } from '../data/samplePatients'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  for (const patient of samplePatients) {
    const createdPatient = await prisma.patient.upsert({
      where: { id: patient.id },
      update: {},
      create: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        gender: patient.sex,
        village: patient.village,
        readings: {
          create: patient.history.map(h => ({
            timestamp: new Date(h.timestamp),
            spo2: h.spo2,
            heartRate: h.heartRate,
            temperatureC: h.temperatureC,
            respiratoryRate: h.respiratoryRate,
            systolicBp: h.systolicBp,
            diastolicBp: h.diastolicBp,
            glucoseMgDl: h.glucoseMgDl
          }))
        }
      }
    })
    console.log(`Created/Updated patient: ${createdPatient.name}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
