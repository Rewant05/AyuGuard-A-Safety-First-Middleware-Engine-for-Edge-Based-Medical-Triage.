# Bill of Materials

Approximate India-facing prototype costs. Prices vary by supplier, availability, display choice, enclosure, and sensor quality.

| Component | Role | Approx cost |
| --- | --- | --- |
| Raspberry Pi Zero 2 W or equivalent edge board | Local compute, dashboard host, risk engine | INR 2,500-4,500 |
| MAX30102 pulse oximeter sensor | SpO2 and pulse input | INR 250-600 |
| DS18B20 or MLX90614 temperature sensor | Contact or non-contact temperature | INR 150-900 |
| Optional BP monitor integration | BP capture via manual, serial, or Bluetooth workflow | INR 1,500-3,500 |
| Small 5 inch display | PHC desk interface | INR 1,800-3,500 |
| Battery backup and charging board | Power continuity | INR 900-1,800 |
| microSD card | Local longitudinal storage | INR 350-700 |
| Enclosure, cables, buttons, mounts | Prototype assembly | INR 800-1,500 |

## Estimated Range

Prototype range: INR 8,000-14,000.

## Why Low-Cost

- Commodity sensors.
- Edge-board compute instead of cloud inference.
- Local storage by default.
- Optional BP and glucose integration instead of mandatory expensive modules.
- Browser-based dashboard on local display.

## Rural Clinic Suitability

- Works during internet outages.
- Can retain patient history locally.
- Designed for health worker triage and clinician escalation.
- Can be extended for multilingual UI.
- Battery backup supports intermittent power.

## Validation Gap

The BoM is a prototype estimate. Clinical deployment would require sensor calibration, electrical safety review, usability testing, infection-control design, and regulatory pathway assessment.
