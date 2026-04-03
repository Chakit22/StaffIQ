import "reflect-metadata";
import "dotenv/config";
import bcrypt from "bcrypt";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Course } from "./entity/Course";
import { Role } from "./entity/Role";
import { Skill } from "./entity/Skill";
import { Availability } from "./entity/Availability";
import { Avatar } from "./entity/Avatar";
import { Application } from "./entity/Application";
import { Experience } from "./entity/Experience";
import Ranking from "./entity/Ranking";
import { Comment } from "./entity/Comment";

async function seed() {
  await AppDataSource.initialize();
  console.log("Database connected. Seeding...");

  const userRepo = AppDataSource.getRepository(User);
  const courseRepo = AppDataSource.getRepository(Course);
  const roleRepo = AppDataSource.getRepository(Role);
  const skillRepo = AppDataSource.getRepository(Skill);
  const availRepo = AppDataSource.getRepository(Availability);
  const avatarRepo = AppDataSource.getRepository(Avatar);
  const appRepo = AppDataSource.getRepository(Application);
  const expRepo = AppDataSource.getRepository(Experience);
  const rankRepo = AppDataSource.getRepository(Ranking);
  const commentRepo = AppDataSource.getRepository(Comment);

  // --- Avatars ---
  const avatarUrls = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
  ];
  const avatars: Avatar[] = [];
  for (const url of avatarUrls) {
    let avatar = await avatarRepo.findOneBy({ url });
    if (!avatar) {
      avatar = avatarRepo.create({ url });
      avatar = await avatarRepo.save(avatar);
    }
    avatars.push(avatar);
  }
  console.log(`Avatars: ${avatars.length}`);

  // --- Roles ---
  const roleNames = ["Tutor", "Lab Assistant", "Marker", "Teaching Assistant"];
  const roles: Role[] = [];
  for (const name of roleNames) {
    let role = await roleRepo.findOneBy({ name });
    if (!role) {
      role = roleRepo.create({ name });
      role = await roleRepo.save(role);
    }
    roles.push(role);
  }
  console.log(`Roles: ${roles.length}`);

  // --- Skills ---
  const skillNames = [
    "JavaScript", "TypeScript", "Python", "Java", "C++",
    "React", "Node.js", "SQL", "Machine Learning", "Data Analysis",
    "Docker", "AWS", "Git", "REST APIs", "GraphQL",
  ];
  const skills: Skill[] = [];
  for (const name of skillNames) {
    let skill = await skillRepo.findOneBy({ name });
    if (!skill) {
      skill = skillRepo.create({ name });
      skill = await skillRepo.save(skill);
    }
    skills.push(skill);
  }
  console.log(`Skills: ${skills.length}`);

  // --- Availabilities ---
  const availNames = ["Full-time", "Part-time", "Weekends Only", "Evenings Only"];
  const availabilities: Availability[] = [];
  for (const availability of availNames) {
    let avail = await availRepo.findOneBy({ availability });
    if (!avail) {
      avail = availRepo.create({ availability });
      avail = await availRepo.save(avail);
    }
    availabilities.push(avail);
  }
  console.log(`Availabilities: ${availabilities.length}`);

  // --- Courses ---
  const courseData = [
    { name: "Full Stack Development", course_code: "COSC2758" },
    { name: "Machine Learning", course_code: "COSC2793" },
    { name: "Database Concepts", course_code: "ISYS1055" },
    { name: "Web Programming", course_code: "COSC2276" },
    { name: "Cloud Computing", course_code: "COSC2759" },
    { name: "Software Engineering", course_code: "COSC2299" },
  ];
  const courses: Course[] = [];
  for (const c of courseData) {
    let course = await courseRepo.findOneBy({ course_code: c.course_code });
    if (!course) {
      course = courseRepo.create(c);
      course = await courseRepo.save(course);
    }
    courses.push(course);
  }
  console.log(`Courses: ${courses.length}`);

  // --- Password (same for all seed users) ---
  const hashedPassword = await bcrypt.hash("Password@123", 10);

  // --- Lecturers ---
  const lecturerData = [
    { name: "Dr. Sarah Chen", email: "sarah.chen@rmit.edu.au", phone: "0412345678" },
    { name: "Prof. James Wilson", email: "james.wilson@rmit.edu.au", phone: "0423456789" },
    { name: "Dr. Priya Sharma", email: "priya.sharma@rmit.edu.au", phone: "0434567890" },
  ];
  const lecturers: User[] = [];
  for (let i = 0; i < lecturerData.length; i++) {
    const d = lecturerData[i];
    let user = await userRepo.findOneBy({ email: d.email });
    if (!user) {
      user = userRepo.create({
        ...d,
        password: hashedPassword,
        role: "lecturer",
        avatar: avatars[i % avatars.length],
      });
      user = await userRepo.save(user);
    }
    lecturers.push(user);
  }
  console.log(`Lecturers: ${lecturers.length}`);

  // Assign courses to lecturers
  lecturers[0].courses = [courses[0], courses[1], courses[3]];
  lecturers[1].courses = [courses[2], courses[4], courses[5]];
  lecturers[2].courses = [courses[0], courses[2], courses[4]];
  for (const lec of lecturers) {
    await userRepo.save(lec);
  }
  console.log("Lecturer-course assignments done");

  // --- Candidates ---
  const candidateData = [
    { name: "Alice Johnson", email: "alice.johnson@student.rmit.edu.au", phone: "0445678901" },
    { name: "Bob Smith", email: "bob.smith@student.rmit.edu.au", phone: "0456789012" },
    { name: "Charlie Lee", email: "charlie.lee@student.rmit.edu.au", phone: "0467890123" },
    { name: "Diana Patel", email: "diana.patel@student.rmit.edu.au", phone: "0478901234" },
    { name: "Ethan Brown", email: "ethan.brown@student.rmit.edu.au", phone: "0489012345" },
    { name: "Fatima Ali", email: "fatima.ali@student.rmit.edu.au", phone: "0490123456" },
    { name: "George Kim", email: "george.kim@student.rmit.edu.au", phone: "0401234567" },
    { name: "Hannah Davis", email: "hannah.davis@student.rmit.edu.au", phone: "0412345679" },
    { name: "Ivan Nguyen", email: "ivan.nguyen@student.rmit.edu.au", phone: "0423456780" },
    { name: "Julia Martinez", email: "julia.martinez@student.rmit.edu.au", phone: "0434567891" },
    { name: "Kevin O'Brien", email: "kevin.obrien@student.rmit.edu.au", phone: "0445678902" },
    { name: "Lily Zhang", email: "lily.zhang@student.rmit.edu.au", phone: "0456789013" },
  ];
  const candidates: User[] = [];
  for (let i = 0; i < candidateData.length; i++) {
    const d = candidateData[i];
    let user = await userRepo.findOneBy({ email: d.email });
    if (!user) {
      user = userRepo.create({
        ...d,
        password: hashedPassword,
        role: "candidate",
        avatar: avatars[(i + 2) % avatars.length],
      });
      user = await userRepo.save(user);
    }
    candidates.push(user);
  }
  console.log(`Candidates: ${candidates.length}`);

  // --- Experiences ---
  const experienceData = [
    { user: candidates[0], role: "Teaching Assistant", company_name: "RMIT University", description: "Assisted in Web Programming tutorials", start_date: new Date("2024-03-01"), end_date: new Date("2024-11-30") },
    { user: candidates[0], role: "Junior Developer", company_name: "TechCorp", description: "Built REST APIs with Node.js", start_date: new Date("2023-06-01"), end_date: new Date("2024-02-28") },
    { user: candidates[1], role: "Lab Demonstrator", company_name: "RMIT University", description: "Ran database lab sessions", start_date: new Date("2024-07-01") },
    { user: candidates[2], role: "Intern", company_name: "DataWorks", description: "Worked on ML pipelines", start_date: new Date("2024-01-15"), end_date: new Date("2024-06-30") },
    { user: candidates[3], role: "Tutor", company_name: "Freelance", description: "Tutored students in Python and Java", start_date: new Date("2023-03-01") },
    { user: candidates[4], role: "Software Engineer", company_name: "CloudNine", description: "Developed microservices on AWS", start_date: new Date("2023-09-01"), end_date: new Date("2024-08-31") },
    { user: candidates[5], role: "Research Assistant", company_name: "RMIT AI Lab", description: "Published paper on NLP techniques", start_date: new Date("2024-02-01") },
    { user: candidates[7], role: "Web Developer", company_name: "StartupXYZ", description: "Built React frontends", start_date: new Date("2024-04-01"), end_date: new Date("2024-12-31") },
  ];
  for (const exp of experienceData) {
    const existing = await expRepo.findOneBy({ role: exp.role, company_name: exp.company_name });
    if (!existing) {
      await expRepo.save(expRepo.create(exp));
    }
  }
  console.log("Experiences seeded");

  // --- Applications ---
  // Each candidate applies to 1-3 courses with different roles/skills
  const acadCreds = ["GPA 3.8", "GPA 3.5", "GPA 3.9", "GPA 3.2", "GPA 3.7", "GPA 4.0", "GPA 3.6", "GPA 3.3", "GPA 3.4", "GPA 3.1", "GPA 3.85", "GPA 3.95"];
  const applications: Application[] = [];

  const appConfigs = [
    // candidate index, course index, role index, avail index, skill indices, academic_creds
    { ci: 0, coi: 0, ri: 0, ai: 0, si: [0, 1, 5, 6], ac: acadCreds[0] },
    { ci: 0, coi: 3, ri: 3, ai: 0, si: [0, 1, 5], ac: acadCreds[0] },
    { ci: 1, coi: 0, ri: 1, ai: 1, si: [0, 7, 13], ac: acadCreds[1] },
    { ci: 1, coi: 2, ri: 0, ai: 1, si: [7, 2], ac: acadCreds[1] },
    { ci: 2, coi: 1, ri: 0, ai: 0, si: [2, 8, 9], ac: acadCreds[2] },
    { ci: 2, coi: 4, ri: 1, ai: 2, si: [10, 11], ac: acadCreds[2] },
    { ci: 3, coi: 0, ri: 2, ai: 1, si: [2, 3, 13], ac: acadCreds[3] },
    { ci: 3, coi: 5, ri: 3, ai: 3, si: [3, 12], ac: acadCreds[3] },
    { ci: 4, coi: 4, ri: 0, ai: 0, si: [10, 11, 6], ac: acadCreds[4] },
    { ci: 4, coi: 0, ri: 1, ai: 0, si: [0, 1, 5, 6, 13], ac: acadCreds[4] },
    { ci: 5, coi: 1, ri: 0, ai: 1, si: [2, 8, 9, 14], ac: acadCreds[5] },
    { ci: 5, coi: 2, ri: 2, ai: 1, si: [7, 2], ac: acadCreds[5] },
    { ci: 6, coi: 3, ri: 1, ai: 2, si: [0, 5, 13], ac: acadCreds[6] },
    { ci: 6, coi: 5, ri: 0, ai: 0, si: [3, 12, 1], ac: acadCreds[6] },
    { ci: 7, coi: 0, ri: 3, ai: 1, si: [0, 1, 5], ac: acadCreds[7] },
    { ci: 7, coi: 3, ri: 0, ai: 1, si: [0, 5, 13], ac: acadCreds[7] },
    { ci: 8, coi: 2, ri: 1, ai: 0, si: [7, 3], ac: acadCreds[8] },
    { ci: 8, coi: 4, ri: 3, ai: 3, si: [10, 11, 6], ac: acadCreds[8] },
    { ci: 9, coi: 1, ri: 2, ai: 0, si: [2, 8, 14], ac: acadCreds[9] },
    { ci: 9, coi: 5, ri: 1, ai: 2, si: [3, 4, 12], ac: acadCreds[9] },
    { ci: 10, coi: 0, ri: 0, ai: 0, si: [0, 1, 5, 6, 13], ac: acadCreds[10] },
    { ci: 10, coi: 2, ri: 3, ai: 1, si: [7], ac: acadCreds[10] },
    { ci: 11, coi: 1, ri: 1, ai: 0, si: [2, 8, 9], ac: acadCreds[11] },
    { ci: 11, coi: 4, ri: 0, ai: 2, si: [10, 11, 6], ac: acadCreds[11] },
  ];

  for (const cfg of appConfigs) {
    const app = appRepo.create({
      academic_creds: cfg.ac,
      user: candidates[cfg.ci],
      userId: candidates[cfg.ci].id,
      course: courses[cfg.coi],
      courseId: courses[cfg.coi].id,
      role: roles[cfg.ri],
      roleId: roles[cfg.ri].id,
      availability: availabilities[cfg.ai],
      availabilityId: availabilities[cfg.ai].id,
      skills: cfg.si.map((i) => skills[i]),
    });
    const saved = await appRepo.save(app);
    applications.push(saved);
  }
  console.log(`Applications: ${applications.length}`);

  // --- Rankings (lecturers rank applications for their courses) ---
  // Lecturer 0 (Sarah) teaches courses[0], courses[1], courses[3]
  // Lecturer 1 (James) teaches courses[2], courses[4], courses[5]
  // Lecturer 2 (Priya) teaches courses[0], courses[2], courses[4]

  const rankingConfigs = [
    // Sarah ranks apps for course 0 (FSD): apps 0,2,6,9,14,20
    { li: 0, appIdx: 0, rank: 1 },
    { li: 0, appIdx: 2, rank: 2 },
    { li: 0, appIdx: 9, rank: 3 },
    { li: 0, appIdx: 20, rank: 4 },
    { li: 0, appIdx: 6, rank: 5 },
    // Sarah ranks apps for course 1 (ML): apps 4,10,18,22
    { li: 0, appIdx: 4, rank: 1 },
    { li: 0, appIdx: 10, rank: 2 },
    { li: 0, appIdx: 22, rank: 3 },
    // Sarah ranks apps for course 3 (Web): apps 1,12,15
    { li: 0, appIdx: 1, rank: 1 },
    { li: 0, appIdx: 15, rank: 2 },
    // James ranks apps for course 2 (DB): apps 3,11,16,21
    { li: 1, appIdx: 3, rank: 1 },
    { li: 1, appIdx: 11, rank: 2 },
    { li: 1, appIdx: 16, rank: 3 },
    // James ranks apps for course 4 (Cloud): apps 5,8,17,23
    { li: 1, appIdx: 8, rank: 1 },
    { li: 1, appIdx: 5, rank: 2 },
    { li: 1, appIdx: 23, rank: 3 },
    { li: 1, appIdx: 17, rank: 4 },
    // James ranks apps for course 5 (SE): apps 7,13,19
    { li: 1, appIdx: 13, rank: 1 },
    { li: 1, appIdx: 7, rank: 2 },
    // Priya ranks apps for course 0 (FSD): apps 0,2,6,9,14,20
    { li: 2, appIdx: 20, rank: 1 },
    { li: 2, appIdx: 0, rank: 2 },
    { li: 2, appIdx: 14, rank: 3 },
    { li: 2, appIdx: 9, rank: 4 },
    // Priya ranks apps for course 2 (DB): apps 3,11,16,21
    { li: 2, appIdx: 11, rank: 1 },
    { li: 2, appIdx: 21, rank: 2 },
    // Priya ranks apps for course 4 (Cloud): apps 5,8,17,23
    { li: 2, appIdx: 23, rank: 1 },
    { li: 2, appIdx: 8, rank: 2 },
    { li: 2, appIdx: 5, rank: 3 },
  ];

  for (const cfg of rankingConfigs) {
    const ranking = rankRepo.create({
      lecturerId: lecturers[cfg.li].id,
      applicationId: applications[cfg.appIdx].id,
      rank: cfg.rank,
    });
    await rankRepo.save(ranking);
  }
  console.log(`Rankings: ${rankingConfigs.length}`);

  // --- Comments ---
  const commentConfigs = [
    { li: 0, appIdx: 0, comment: "Excellent candidate with strong full-stack skills. Highly recommended for tutor role." },
    { li: 0, appIdx: 2, comment: "Good SQL knowledge, would benefit from more frontend experience." },
    { li: 0, appIdx: 4, comment: "Outstanding ML background. Top pick for this course." },
    { li: 0, appIdx: 10, comment: "Strong research background in AI. Great fit for ML course." },
    { li: 1, appIdx: 3, comment: "Solid database fundamentals. Good communicator." },
    { li: 1, appIdx: 8, comment: "Impressive cloud experience with AWS. Perfect for Cloud Computing." },
    { li: 1, appIdx: 13, comment: "Well-rounded developer with good Java skills." },
    { li: 2, appIdx: 20, comment: "Best all-rounder. Strong across all required skills for FSD." },
    { li: 2, appIdx: 11, comment: "Very thorough understanding of database concepts." },
    { li: 2, appIdx: 23, comment: "Good Docker and AWS skills. Reliable candidate." },
  ];

  for (const cfg of commentConfigs) {
    const comment = commentRepo.create({
      lecturerId: lecturers[cfg.li].id,
      applicationId: applications[cfg.appIdx].id,
      comment: cfg.comment,
    });
    await commentRepo.save(comment);
  }
  console.log(`Comments: ${commentConfigs.length}`);

  console.log("\n--- Seed Complete ---");
  console.log("Login credentials for all users: Password@123");
  console.log("\nLecturers:");
  lecturers.forEach((l) => console.log(`  ${l.name} — ${l.email}`));
  console.log("\nCandidates:");
  candidates.forEach((c) => console.log(`  ${c.name} — ${c.email}`));

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
