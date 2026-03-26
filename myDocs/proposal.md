# Hospital Management System (HMS) - Project Proposal (SCOPE DOCUMENT)

[cite_start]**COMSATS University Islamabad, Sahiwal Campus** [cite: 5, 6]

[cite_start]**For:** Hospital Management System (web app) [cite: 8, 9, 10]
[cite_start]**By:** \* Muhammad Eesa (CIIT/FA23-BSE-045/SWL) [cite: 12, 13]

- [cite_start]Muhammad Abdullah (CIIT/FA23-BSE-022/SWL) [cite: 14, 15]
- [cite_start]Faisal Islam (CIIT/FA23-BSE-055/SWL) [cite: 16, 17]

[cite_start]**Supervisor:** Sir Khurram Nisar [cite: 18, 19]
[cite_start]**Degree:** Bachelor of Science in Computer Science (2023-2027) [cite: 20]

---

## [cite_start]Contents [cite: 21, 22]

1. Introduction ....5
2. Problem Statement .5
3. Problem Solution for Proposed System ..5
4. Related System Analysis / Literature Review .6
5. Advantages / Benefits of Proposed System 6
6. Scope 7
7. Modules 7
   - 7.1 Module 1: User Authentication & Security. .7
   - 7.2 Module 2: Patient Management .8
   - 7.3 Module 3: Appointment Management. .8
   - 7.4 Module 4: Electronic Medical Records (EMR) 8
   - 7.5 Module 5: Prescription & Pharmacy Management .8
   - 7.6 Module 6: Billing & Payment System. 9
8. System Limitations / Constraints ..9
9. Software Process Methodology. .9
10. Tools and Technologies 10
    - Frontend 10
    - Backend. 10
    - Database 10
    - Other Tools 10
11. Project Stakeholders and Roles 10
12. Team Members Individual Tasks / Work Division. 11
13. Data Gathering Approach 11
14. Concepts 12
15. Gantt Chart. 12
16. Mockups 12
17. Conclusion 12
18. References 13
19. Plagiarism Report 13

---

## [cite_start]Abstract [cite: 23]

[cite_start]The Hospital Management System (HMS) is a web-based platform designed to digitalize and streamline hospital operations[cite: 24]. [cite_start]Traditional hospital systems often rely on manual processes for patient registration, appointment scheduling, medical record keeping, and billing[cite: 25]. [cite_start]These manual processes are time-consuming, error-prone, and inefficient[cite: 26]. [cite_start]The proposed system provides an integrated digital solution where patients can register online, book appointments with doctors, and view their medical history[cite: 27]. [cite_start]Doctors can manage appointments, review patient records, write prescriptions, and record diagnoses[cite: 28]. [cite_start]Administrators can manage users, generate reports, and monitor hospital operations[cite: 29]. [cite_start]The system will be developed using modern web technologies including Next.js, React, TypeScript, Tailwind CSS, Node.js, and MongoDB[cite: 30]. [cite_start]The backend logic will be implemented using Next.js Server Actions, while MongoDB with Mongoose will handle database management[cite: 31]. [cite_start]The Hospital Management System improves efficiency, accuracy, and accessibility while reducing paperwork and administrative workload[cite: 32]. [cite_start]It also enhances communication between patients, doctors, and hospital staff[cite: 33].

---

| No. | Comments | Action       |
| :-- | :------- | :----------- | ---------- |
|     |          | [cite_start] | [cite: 34] |

[cite_start]**Supervisor Signature:** ********\_\_\_\_******** [cite: 35]
[cite_start]**Date:** ********\_\_\_\_******** [cite: 36]

---

## [cite_start]1. Introduction [cite: 37]

[cite_start]The Hospital Management System (HMS) is a web-based application designed to automate hospital operations and improve healthcare service management[cite: 38]. [cite_start]Traditional hospital systems rely on manual record keeping for patient registration, appointment scheduling, prescriptions, and billing[cite: 39]. [cite_start]This often leads to data loss, scheduling conflicts, slow service, and difficulty in maintaining patient history[cite: 40]. [cite_start]The proposed system replaces manual processes with a digital platform where patients, doctors, and administrators can interact efficiently[cite: 41]. [cite_start]Patients can book appointments online, doctors can manage consultations and prescriptions, and administrators can oversee hospital operations[cite: 42]. [cite_start]The system improves efficiency, transparency, and data management in healthcare environments[cite: 43].

## [cite_start]2. Problem Statement [cite: 44]

[cite_start]Many hospitals still rely on manual systems or outdated software for managing their operations[cite: 45]. This creates several problems:

- [cite_start]Patient records are difficult to manage manually [cite: 46]
- [cite_start]Appointment scheduling can cause conflicts [cite: 47]
- [cite_start]Medical history tracking becomes difficult [cite: 48]
- [cite_start]Billing and payment processes are inefficient [cite: 49]
- [cite_start]Lack of communication between departments [cite: 50]
- [cite_start]Risk of data loss and human errors [cite: 51]

[cite_start]Therefore, a modern web-based Hospital Management System is required to automate hospital workflows and improve healthcare management[cite: 52].

## [cite_start]3. Problem Solution for Proposed System [cite: 53]

[cite_start]The proposed Hospital Management System provides a digital platform that automates hospital operations[cite: 54]. [cite_start]The system will provide: [cite: 55]

- [cite_start]Online patient registration and login [cite: 56]
- [cite_start]Appointment booking with doctors [cite: 57]
- [cite_start]Doctor dashboard for managing consultations [cite: 58]
- [cite_start]Electronic Medical Records (EMR) management [cite: 59]
- [cite_start]Prescription and treatment management [cite: 60]
- [cite_start]Pharmacy module for medicine dispensing [cite: 61]
- [cite_start]Billing and payment system [cite: 62]
- [cite_start]Admin dashboard for monitoring hospital operations [cite: 63]

[cite_start]This system reduces manual workload, improves patient service, and ensures secure and accurate record management[cite: 64].

---

## [cite_start]4. Related System Analysis / Literature Review [cite: 65]

[cite_start]Several hospital management systems exist today, but many are complex or designed for large healthcare organizations[cite: 66]. [cite_start]Traditional hospital systems often rely on manual record keeping or fragmented software solutions that lack integration between departments[cite: 67]. [cite_start]Some healthcare platforms provide appointment booking or electronic medical records but may not include pharmacy, billing, or reporting modules in a unified system[cite: 68]. [cite_start]The proposed Hospital Management System provides: [cite: 69]

- [cite_start]Integrated appointment management [cite: 70]
- [cite_start]Electronic medical record tracking [cite: 71]
- [cite_start]Prescription and pharmacy management [cite: 72]
- [cite_start]Billing and financial reporting [cite: 73]
- [cite_start]Multi-role access for administrators, doctors, and patients [cite: 74]

[cite_start]This integrated approach improves overall hospital efficiency and patient experience[cite: 75].

## [cite_start]5. Advantages / Benefits of Proposed System [cite: 76]

[cite_start]The proposed system provides several benefits: [cite: 77]

- [cite_start]**Automation** - Reduces manual paperwork [cite: 78]
- [cite_start]**Efficiency** - Faster appointment scheduling and patient handling [cite: 79]
- [cite_start]**Accuracy** - Reduces human errors in records [cite: 80]
- [cite_start]**Data Security** - Secure storage of patient records [cite: 81]
- [cite_start]**Accessibility** - Users can access the system online [cite: 82]
- [cite_start]**Better Communication** - Improves coordination between doctors and patients [cite: 83]
- [cite_start]**Reporting** - Admin can generate operational and financial reports [cite: 84]

## [cite_start]6. Scope [cite: 85]

[cite_start]The scope of the Hospital Management System includes: [cite: 86]

- [cite_start]Patient registration and account management [cite: 87]
- [cite_start]Appointment scheduling with doctors [cite: 88]
- [cite_start]Electronic medical record management [cite: 89]
- [cite_start]Doctor consultation and diagnosis recording [cite: 90]
- [cite_start]Prescription generation [cite: 91]
- [cite_start]Pharmacy medicine dispensing [cite: 92]
- [cite_start]Billing and payment management [cite: 93]
- [cite_start]Reporting and analytics for administrators [cite: 94]

[cite_start]The system is designed for hospitals, clinics, and healthcare centers to manage their daily operations digitally[cite: 95].

## [cite_start]7. Modules [cite: 96]

### [cite_start]7.1 Module 1: User Authentication & Security [cite: 97]

[cite_start]This module manages secure login and authentication for all system users[cite: 98].
[cite_start]**Features:** [cite: 99]

- [cite_start]User registration and login [cite: 100]
- [cite_start]Role-based access control (Admin, Doctor, Patient, Pharmacy) [cite: 101]
- [cite_start]Password security and verification [cite: 102]
- [cite_start]Two-factor authentication (optional) [cite: 103]

---

### [cite_start]7.2 Module 2: Patient Management [cite: 104]

[cite_start]This module handles patient registration and medical history[cite: 105].
[cite_start]**Features:** [cite: 106]

- [cite_start]Patient registration [cite: 107]
- [cite_start]Patient profile management [cite: 108]
- [cite_start]Medical history tracking [cite: 109]
- [cite_start]Access to prescriptions and reports [cite: 110]

### [cite_start]7.3 Module 3: Appointment Management [cite: 111]

[cite_start]This module manages scheduling between patients and doctors[cite: 112].
[cite_start]**Features:** [cite: 113]

- [cite_start]View available doctors [cite: 114]
- [cite_start]Book appointments [cite: 115]
- [cite_start]Reschedule or cancel appointments [cite: 116]
- [cite_start]Doctor appointment calendar [cite: 117]

### [cite_start]7.4 Module 4: Electronic Medical Records (EMR) [cite: 118]

[cite_start]This module stores patient medical data digitally[cite: 119].
[cite_start]**Features:** [cite: 120]

- [cite_start]Diagnosis recording [cite: 121]
- [cite_start]Patient history tracking [cite: 122]
- [cite_start]Lab reports and documents [cite: 123]
- [cite_start]Consultation notes [cite: 124]

### [cite_start]7.5 Module 5: Prescription & Pharmacy Management [cite: 125]

[cite_start]This module handles prescriptions and medicine dispensing[cite: 126].
[cite_start]**Features:** [cite: 127]

- [cite_start]Digital prescription creation [cite: 128]
- [cite_start]Pharmacy receives prescriptions [cite: 129]
- [cite_start]Medicine inventory tracking [cite: 130]
- [cite_start]Low stock alerts [cite: 131]

### [cite_start]7.6 Module 6: Billing & Payment System [cite: 132]

[cite_start]This module manages hospital billing[cite: 133].
[cite_start]**Features:** [cite: 134]

- [cite_start]Invoice generation [cite: 135]
- [cite_start]Payment processing [cite: 136]
- [cite_start]Insurance claim management [cite: 137]
- [cite_start]Payment history tracking [cite: 138]

---

## [cite_start]8. System Limitations / Constraints [cite: 139]

[cite_start]Some limitations of the system include: [cite: 140]

- [cite_start]Requires internet connectivity [cite: 141]
- [cite_start]Data privacy must be carefully managed [cite: 142]
- [cite_start]Initial system setup required by administrators [cite: 143]
- [cite_start]System performance depends on server availability [cite: 144]

## [cite_start]9. Software Process Methodology [cite: 145]

[cite_start]The system will be developed using Agile Development Methodology[cite: 146]. [cite_start]Agile allows: [cite: 147]

- [cite_start]Continuous development [cite: 148]
- [cite_start]Iterative improvements [cite: 149]
- [cite_start]Frequent testing [cite: 150]
- [cite_start]Quick feedback from stakeholders [cite: 151]

[cite_start]**Development stages include:** [cite: 152]

1. [cite_start]Requirement Analysis [cite: 153]
2. [cite_start]System Design [cite: 154]
3. [cite_start]Database Design [cite: 155]
4. [cite_start]Development [cite: 156]
5. [cite_start]Testing [cite: 157]
6. [cite_start]Deployment [cite: 158]

---

## [cite_start]10. Tools and Technologies [cite: 159]

[cite_start]**Frontend** [cite: 160]

- [cite_start]Next.js [cite: 161]
- [cite_start]React [cite: 162]
- [cite_start]TypeScript [cite: 163]
- [cite_start]Tailwind CSS [cite: 164]

[cite_start]**Backend** [cite: 165]

- [cite_start]Node.js (Next.js Runtime) [cite: 166]
- [cite_start]Next.js Server Actions [cite: 167]

[cite_start]**Database** [cite: 168]

- [cite_start]MongoDB [cite: 169]
- [cite_start]Mongoose ORM [cite: 170]

[cite_start]**Other Tools** [cite: 171]

- [cite_start]GitHub (Version Control) [cite: 172]
- [cite_start]VS Code (Development Environment) [cite: 173]

## [cite_start]11. Project Stakeholders and Roles [cite: 174]

- [cite_start]**Administrator:** Manages users, appointments, system configuration, and reports[cite: 175, 176].
- [cite_start]**Doctors:** Manage patient consultations, medical records, and prescriptions[cite: 177, 178].
- [cite_start]**Patients:** Register, book appointments, and view medical history[cite: 179, 180].
- [cite_start]**Pharmacy Staff:** Dispense medicines and manage pharmacy inventory[cite: 181, 182].
- [cite_start]**Project Supervisor:** Guides the development and validates project requirements[cite: 183, 184].

## [cite_start]12. Team Members Individual Tasks / Work Division [cite: 185]

- [cite_start]**Muhammad Abdullah:** Frontend Development, Dashboard UI Design[cite: 186, 187].
- [cite_start]**Muhammad Eesa:** Appointment Interface, Patient Portal Development[cite: 188, 189, 190].

## [cite_start]13. Data Gathering Approach [cite: 191]

[cite_start]System requirements were gathered using: [cite: 192]

- [cite_start]Research on existing hospital systems [cite: 193]
- [cite_start]Observation of hospital workflows [cite: 194]
- [cite_start]Analysis of healthcare management software [cite: 195]
- [cite_start]Consultation with domain knowledge resources [cite: 196]

---

## [cite_start]14. Concepts [cite: 197]

[cite_start]The system is based on the following concepts: [cite: 198]

- [cite_start]Web-based Information Systems [cite: 199]
- [cite_start]Database Management Systems [cite: 200]
- [cite_start]Electronic Medical Records (EMR) [cite: 201]
- [cite_start]Authentication & Authorization [cite: 202]
- [cite_start]Healthcare Data Management [cite: 203]

## [cite_start]15. Gantt Chart [cite: 204]

[cite_start]**Project development phases:** [cite: 205]

1. [cite_start]Requirement Gathering [cite: 206]
2. [cite_start]System Design [cite: 207]
3. [cite_start]Database Design [cite: 208]
4. [cite_start]Frontend Development [cite: 209]
5. [cite_start]Backend Development [cite: 210]
6. [cite_start]Integration and Testing [cite: 211]
7. [cite_start]Deployment [cite: 211]

## [cite_start]16. Mockups [cite: 212]

[cite_start]The system includes the following interface designs: [cite: 213]

- [cite_start]Login Page [cite: 214]
- [cite_start]Patient Dashboard [cite: 215]
- [cite_start]Doctor Dashboard [cite: 216]
- [cite_start]Appointment Booking Page [cite: 217]
- [cite_start]Prescription Page [cite: 218]
- [cite_start]Billing & Invoice Page [cite: 219]
- [cite_start]Admin Dashboard [cite: 220]

## [cite_start]17. Conclusion [cite: 221]

[cite_start]The Hospital Management System provides a digital platform that improves hospital efficiency and patient service[cite: 222]. [cite_start]The system automates appointment scheduling, medical record management, prescriptions, pharmacy operations, and billing[cite: 223]. [cite_start]By replacing manual processes with a web-based solution, the system enhances accuracy, reduces workload, and improves healthcare management[cite: 224].

## [cite_start]18. References [cite: 225]

- [cite_start]Next.js Official Documentation [cite: 226]
- [cite_start]MongoDB Documentation [cite: 227]
- [cite_start]Software Engineering - Ian Sommerville [cite: 228]
- [cite_start]Healthcare Information Systems Research [cite: 229]

## [cite_start]19. Plagiarism Report [cite: 230]

[cite_start]The project documentation has been reviewed to ensure originality and compliance with academic integrity policies[cite: 231].

---

## [cite_start]20. ER Diagram [cite: 232]

### [cite_start]Admin (E) [cite: 233]

- [cite_start]admin_id : int «PK» [cite: 234]
- [cite_start]name : string [cite: 235]
- [cite_start]email : string [cite: 236]
- [cite_start]password : string [cite: 237]
- [cite_start]_Relations:_ registers Patient [cite: 238][cite_start], manages Doctor [cite: 239]

### [cite_start]Patient (E) [cite: 240]

- [cite_start]patient_id : int «PK» [cite: 241]
- [cite_start]name : string [cite: 241]
- [cite_start]email : string [cite: 241]
- [cite_start]password : string [cite: 241]
- [cite_start]phone : string [cite: 241]
- [cite_start]gender : string [cite: 241]
- [cite_start]date_of_birth : date [cite: 242]
- [cite_start]address : text [cite: 242]
- [cite_start]_Relations:_ books Appointment [cite: 244][cite_start], has Medical_Record [cite: 244]

### [cite_start]Doctor (E) [cite: 245]

- [cite_start]doctor_id : int «PK» [cite: 246]
- [cite_start]name : string [cite: 247]
- [cite_start]email : string [cite: 247]
- [cite_start]specialization : string [cite: 248]
- [cite_start]phone : string [cite: 248]
- [cite_start]experience : int [cite: 248]
- [cite_start]_Relations:_ handles Appointment [cite: 249][cite_start], creates Medical_Record [cite: 250]

### [cite_start]Appointment (E) [cite: 251]

- [cite_start]appointment_id : int «PK» [cite: 252]
- [cite_start]appointment_date : date [cite: 252]
- [cite_start]appointment_time : time [cite: 252]
- [cite_start]status : string [cite: 253]
- [cite_start]_Relations:_ generates_bill Billing [cite: 260]

### [cite_start]Medical_Record (E) [cite: 254]

- [cite_start]record_id : int «PK» [cite: 255]
- [cite_start]diagnosis : text [cite: 256]
- [cite_start]treatment : text [cite: 257]
- [cite_start]notes : text [cite: 258]
- [cite_start]visit_date : date [cite: 259]
- [cite_start]_Relations:_ generates Prescription [cite: 263]

### [cite_start]Billing (E) [cite: 261]

- [cite_start]bill_id : int «PK» [cite: 262]
- [cite_start]total_amount : decimal [cite: 262]
- [cite_start]payment_status : string [cite: 262]
- [cite_start]payment_method : string [cite: 262]
- [cite_start]bill_date : date [cite: 262]

### [cite_start]Prescription (E) [cite: 264]

- [cite_start]prescription_id : int «PK» [cite: 265]
- [cite_start]medicine_name : string [cite: 265]
- [cite_start]dosage : string [cite: 265]
- [cite_start]duration : string [cite: 266]
- [cite_start]instructions : text [cite: 266]
- [cite_start]_Relations:_ dispensed_by Pharmacy [cite: 267]

### [cite_start]Pharmacy (E) [cite: 268]

- [cite_start]pharmacy_id : int «PK» [cite: 269]
- [cite_start]medicine_name : string [cite: 270]
- [cite_start]quantity : int [cite: 270]
- [cite_start]price : decimal [cite: 270]

---

## [cite_start]21. Schema Diagram [cite: 271]

### [cite_start]**admins** [cite: 272]

- admin_id (Int)
- name (varchar)
- email (varchar)
- password (varchar)

### [cite_start]**pharmacy** [cite: 273]

- pharmacy_id (Int)
- [cite_start]medicine_name (varchar) [cite: 274, 275]
- [cite_start]quantity (Int) [cite: 274]
- [cite_start]price (decimal) [cite: 276, 277]

### [cite_start]**patients** [cite: 278]

- [cite_start]patient_id (int) [cite: 281, 282]
- [cite_start]name (varchar) [cite: 285, 286]
- [cite_start]email (varchar) [cite: 288, 289]
- [cite_start]password (varchar) [cite: 291, 292]
- [cite_start]phone (varchar) [cite: 295]
- [cite_start]gender (varchar) [cite: 298, 299]
- [cite_start]date_of_birth [cite: 302]
- [cite_start]address (text) [cite: 304, 305]
- [cite_start]created_at (datetime) [cite: 306, 307]

### [cite_start]**medical_records** [cite: 279]

- record_id (int) [cite: 283, 284]
- [cite_start]patient_id (int) [cite: 287]
- doctor_id (int) [cite: 290]
- [cite_start]diagnosis (text) [cite: 293, 294]
- [cite_start]Treatment (Text) [cite: 296, 297]
- notes (Text) [cite: 300, 301]
- [cite_start]visit_date [cite: 303]

### [cite_start]**prescriptions** [cite: 280]

- prescription_id (int)
- record_id (int)
- medicine_name (varchar)
- dosage (varchar)
- duration (varchar)
- instructions (text)

### [cite_start]**billing** [cite: 308]

- bill_id (int)
- appointment_id (int)
- total_amount (decimal)
- payment_status (varchar)
- payment_method (varchar)
- bill_date (date)

### [cite_start]**appointments** [cite: 309]

- appointment_id (int)
- patient_id (int)
- doctor_id (int)
- appointment_date (date)
- appointment_time (time)
- status (varchar)

### [cite_start]**doctors** [cite: 310]

- doctor_id (int)
- name (varchar)
- email (varchar)
- specialization (varchar)
- phone (varchar)
- experience (int)
- availability (varchar)
