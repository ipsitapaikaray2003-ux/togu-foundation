import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function autoInitializeDatabase() {
  console.log('🔄 [AutoInit] Checking database schema & initial setup...');
  let conn;

  try {
    conn = await pool.getConnection();

    // 1. Read schema.sql and execute table definitions
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      
      // Clean comments and split by semicolon
      const statements = sqlContent
        .replace(/--.*$/gm, '')
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      // Disable foreign key checks during creation
      await conn.query('SET FOREIGN_KEY_CHECKS = 0');

      for (const statement of statements) {
        try {
          await conn.query(statement);
        } catch (stmtErr) {
          // Ignore harmless warnings (like already exists)
          if (!stmtErr.message.includes('already exists')) {
            console.warn('⚠️ [AutoInit] Statement notice:', stmtErr.message.slice(0, 100));
          }
        }
      }

      await conn.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('✅ [AutoInit] Schema tables checked / created.');
    }

    // 2. Check if admin users already exist
    const [adminRows] = await conn.query('SELECT COUNT(*) as cnt FROM admin_users');
    const adminCount = adminRows[0]?.cnt || 0;

    if (adminCount === 0) {
      console.log('👤 [AutoInit] First-time setup detected. Seeding initial admin users and content...');
      
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('togu@2026', salt);

      // Insert default admins
      await conn.query(
        `INSERT INTO admin_users (name, email, password, role, status, phone) VALUES 
         ('Super Admin', 'admin@togufoundation.org', ?, 'Super Admin', 'Active', '+91 98765 43210'),
         ('Operations Manager', 'manager@togufoundation.org', ?, 'Admin', 'Active', '+91 98765 43211'),
         ('Field Coordinator', 'staff@togufoundation.org', ?, 'Staff', 'Active', '+91 98765 43212')`,
        [passwordHash, passwordHash, passwordHash]
      );

      // Insert default 12 programs
      const defaultPrograms = [
        ['Healthcare & Health Awareness', 'healthcare-health-awareness', 'Healthcare', 'Free medical check-up camps, rural diagnostic drives, medicine distribution and preventive health workshops.', 'Our healthcare mission brings qualified doctors and free medical check-ups directly to underserved rural and urban slum communities. We provide essential medicines, pediatric care, eye check-ups, and health education to thousands in need.', '/healthcare-camp.jpg', 'Hyderabad & Rural Telangana', 'Published', 1],
        ['Education & Student Support', 'education-student-support', 'Education', 'Scholarships, school kit distribution, tuition support and digital literacy for underprivileged students.', 'Ensuring that no child is forced to drop out of school due to financial hardship. We distribute school supplies, bridge learning gaps, and support higher education for deserving students.', '/education.jpg', 'Telangana & Andhra Pradesh', 'Published', 1],
        ['Women Empowerment', 'women-empowerment', 'Livelihood', 'Self-help groups, vocational tailoring courses, financial literacy and micro-enterprise mentorship.', 'Empowering rural women with vocational training, tailoring centers, financial literacy, and entrepreneurship skills to build financially independent livelihoods.', '/women-empowerment.jpg', 'Balanagar & Surrounding Districts', 'Published', 1],
        ['Youth Skill Development', 'youth-skill-development', 'Education', 'Computer software training, spoken English classes and interview readiness for underprivileged youth.', 'Equipping rural and urban youth with high-demand digital skills, coding fundamentals, spoken English, and job-placement assistance.', '/youth-skills.jpg', 'Hyderabad Tech Center', 'Published', 1],
        ['Elderly & Senior Care', 'elderly-senior-care', 'Healthcare', 'Monthly nutritional rations, free medicines, companionship and geriatric healthcare for vulnerable seniors.', 'Providing dignity, care, and healthcare support to abandoned and destitute elderly citizens.', '/elderly-care.jpg', 'Old Age Homes & Day Care Centers', 'Published', 0],
        ['Child Welfare & Nutrition', 'child-welfare-nutrition', 'Nutrition', 'Daily supplementary nutrition, mid-day meals, immunity supplements and health checkups in slums.', 'Combating child malnutrition in urban slums and rural hamlets through balanced nutrition kits, clean drinking water, and pediatric monitoring.', '/child-nutrition.jpg', 'Community Centers', 'Published', 0],
        ['Environmental Conservation', 'environmental-conservation', 'Environment', 'Tree plantation drives, plastic-free neighborhood awareness, and groundwater recharge initiatives.', 'Protecting our local ecosystems through large-scale sapling plantations, waste segregation workshops, and clean village campaigns.', '/environment.jpg', 'Various Rural & Urban Locations', 'Published', 0],
        ['Clean Drinking Water (Jal Seva)', 'clean-drinking-water', 'Healthcare', 'Community RO water filtration plants in arsenic and fluoride affected rural villages.', 'Installing sustainable, community-maintained reverse osmosis drinking water kiosks in rural villages facing contaminated groundwater.', '/water-plant.jpg', 'Rural Communities', 'Published', 0],
        ['Disaster Relief & Emergency Aid', 'disaster-relief-emergency-aid', 'Emergency', 'Rapid response food packets, temporary shelters, blankets and medical aid during floods and crises.', 'Rapid-response emergency task force delivering immediate relief supplies, hot meals, hygiene kits, and rebuilding support during natural disasters.', '/disaster-relief.jpg', 'Crisis-Affected Regions', 'Published', 0],
        ['Differently-Abled Support', 'differently-abled-support', 'Healthcare', 'Wheelchairs, prosthetic aids, braille literacy kits and barrier-free vocational coaching.', 'Enabling persons with disabilities with assistive devices, mobility aids, specialized vocational coaching, and equal societal opportunities.', '/differently-abled.jpg', 'Regional Rehabilitation Centers', 'Published', 0],
        ['Rural Infrastructure & Solar Lighting', 'rural-infrastructure-solar', 'Community', 'Solar street lights in un-electrified tribal hamlets, community hall renovations and sanitation units.', 'Bringing sustainable solar streetlights and community sanitation infrastructure to remote tribal hamlets lacking grid connectivity.', '/solar-rural.jpg', 'Tribal & Remote Villages', 'Published', 0],
        ['Legal Rights & Social Justice Advocacy', 'legal-rights-advocacy', 'Advocacy', 'Free legal aid clinics, awareness on government welfare schemes and citizen documentation drives.', 'Providing free legal counseling, guidance on government beneficiary schemes, and helping citizens secure official identity documents.', '/legal-aid.jpg', 'Community Legal Help Desks', 'Published', 0]
      ];

      for (const prog of defaultPrograms) {
        await conn.query(
          `INSERT INTO programs (title, slug, category, short_description, full_description, cover_image, location, status, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title)`,
          prog
        );
      }

      // Insert default website content
      const heroContent = {
        title: 'Empowering Communities, Transforming Lives',
        subtitle: 'TOGU Foundation is committed to grassroots upliftment through healthcare access, quality education, youth livelihood, and holistic rural development.',
        primaryCtaText: 'Donate Now',
        primaryCtaLink: '/donate',
        secondaryCtaText: 'Explore Programs',
        secondaryCtaLink: '#programs',
        sliderImages: ['/hero1.jpg', '/hero2.jpg', '/hero3.jpg', '/hero4.jpg']
      };

      const aboutContent = {
        badge: 'ABOUT TOGU FOUNDATION',
        heading: 'Dedicated to Grassroots Transformation',
        storyParagraph1: 'Founded with a deep mission to serve humanity, TOGU Foundation works at the grassroots level to bring meaningful change to underprivileged families across Telangana and Andhra Pradesh.',
        storyParagraph2: 'From free diagnostic medical camps to educational scholarships, our team and volunteers work tirelessly every day to ensure that every individual has the opportunity to live with health, education, and dignity.',
        vision: 'To build a compassionate, equitable society where every individual has access to quality healthcare, empowering education, and sustainable livelihoods.',
        mission: 'To serve underprivileged communities with transparency, grassroots action, and community participation through dedicated health, education, and welfare drives.',
        values: ['Integrity & Transparency', 'Community-First Action', 'Empowerment through Education', 'Compassion in Care']
      };

      const contactContent = {
        email: 'togufoundation@gmail.com',
        phone: '+91 80082 04845',
        address: 'Balanagar, Hyderabad, Telangana - 500037',
        workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM',
        social: {
          facebook: 'https://facebook.com/togufoundation',
          instagram: 'https://instagram.com/togufoundation',
          twitter: 'https://twitter.com/togufoundation',
          linkedin: 'https://linkedin.com/company/togufoundation'
        }
      };

      const statsContent = {
        peopleSupported: '15,000+',
        medicalDrives: '120+',
        activeVolunteers: '350+',
        programsActive: '12 Focus Areas'
      };

      const contentEntries = [
        ['hero', 'HERO SECTION', heroContent],
        ['about', 'ABOUT SECTION', aboutContent],
        ['contact_info', 'CONTACT INFO', contactContent],
        ['impact_stats', 'IMPACT STATS', statsContent]
      ];

      for (const [key, title, jsonContent] of contentEntries) {
        await conn.query(
          `INSERT INTO website_content (section_key, title, content, status)
           VALUES (?, ?, ?, 'Published')
           ON DUPLICATE KEY UPDATE content = VALUES(content)`,
          [key, title, JSON.stringify(jsonContent)]
        );
      }

      console.log('🎉 [AutoInit] Seeding complete! Super Admin: admin@togufoundation.org / togu@2026');
    } else {
      console.log(`✅ [AutoInit] Database already contains ${adminCount} admin user(s). Ready!`);
    }

  } catch (err) {
    console.error('⚠️ [AutoInit] Auto-initialization warning:', err.message);
  } finally {
    if (conn) conn.release();
  }
}
