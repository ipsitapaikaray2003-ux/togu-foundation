import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

async function seedDatabase() {
  console.log('🌱 Starting TOGU Foundation Database Seed...');
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1. Seed Admin Users
    console.log('👤 Seeding Admin Users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('togu@2026', salt);

    const users = [
      ['Super Admin', 'admin@togufoundation.org', passwordHash, 'Super Admin', 'Active', '+91 98765 43210'],
      ['Operations Manager', 'manager@togufoundation.org', passwordHash, 'Admin', 'Active', '+91 98765 43211'],
      ['Field Coordinator', 'staff@togufoundation.org', passwordHash, 'Staff', 'Active', '+91 98765 43212']
    ];

    for (const [name, email, pass, role, status, phone] of users) {
      await conn.query(
        `INSERT INTO admin_users (name, email, password, role, status, phone) 
         VALUES (?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), status = VALUES(status)`,
        [name, email, pass, role, status, phone]
      );
    }

    // 2. Seed 12 Official NGO Programs
    console.log('📚 Seeding 12 NGO Focus Area Programs...');
    const programs = [
      {
        title: 'Healthcare & Health Awareness',
        slug: 'healthcare-health-awareness',
        category: 'Healthcare',
        short_description: 'Free medical check-up camps, rural diagnostic drives, medicine distribution and preventive health workshops.',
        full_description: 'Our healthcare mission brings qualified doctors and free medical check-ups directly to underserved rural and urban slum communities. We provide essential medicines, pediatric care, eye check-ups, and health education to thousands in need.',
        cover_image: '/healthcare-camp.jpg',
        location: 'Hyderabad & Rural Telangana',
        status: 'Published',
        featured: 1
      },
      {
        title: 'Education & Student Support',
        slug: 'education-student-support',
        category: 'Education',
        short_description: 'Scholarships, school kit distribution, tuition support and digital literacy for underprivileged students.',
        full_description: 'Ensuring that no child is forced to drop out of school due to financial hardship. We distribute school supplies, bridge learning gaps, and support higher education for deserving students.',
        cover_image: '/education.jpg',
        location: 'Telangana & Andhra Pradesh',
        status: 'Published',
        featured: 1
      },
      {
        title: 'Women Empowerment',
        slug: 'women-empowerment',
        category: 'Livelihood',
        short_description: 'Self-help groups, vocational tailoring courses, financial literacy and micro-enterprise mentorship.',
        full_description: 'Empowering women with economic self-reliance through tailoring training centers, micro-business grants, and confidence-building workshops across rural clusters.',
        cover_image: '/women-empowerment.jpg',
        location: 'Hyderabad & Surrounds',
        status: 'Published',
        featured: 1
      },
      {
        title: 'Youth Skill Development & Employment',
        slug: 'youth-skill-development',
        category: 'Skill Development',
        short_description: 'Job-oriented skill training, computer fundamentals, communication courses and job placement assistance.',
        full_description: 'Bridging the gap between rural youth and modern employment opportunities through certified IT literacy, spoken English, and vocational skills training.',
        cover_image: '/youth-skills.jpg',
        location: 'Telangana',
        status: 'Published',
        featured: 0
      },
      {
        title: 'Rural & Community Development',
        slug: 'rural-community-development',
        category: 'Community',
        short_description: 'Clean drinking water initiatives, sanitation drives, solar streetlights and village infrastructure repair.',
        full_description: 'Working hand-in-hand with village elders and local bodies to install water filtration units, renovate public spaces, and improve basic village sanitation facilities.',
        cover_image: '/rural-dev.jpg',
        location: 'Rural Districts',
        status: 'Published',
        featured: 0
      },
      {
        title: 'Livelihood & Entrepreneurship',
        slug: 'livelihood-entrepreneurship',
        category: 'Livelihood',
        short_description: 'Seed capital guidance, artisan support, cottage industry revival and small vendor assistance.',
        full_description: 'Supporting daily-wage earners and traditional artisans to build sustainable family livelihoods through toolkits, marketing linkages, and zero-interest micro-loans.',
        cover_image: '/livelihood.jpg',
        location: 'Urban & Semi-Urban Clusters',
        status: 'Published',
        featured: 0
      },
      {
        title: 'Senior Citizen Support',
        slug: 'senior-citizen-support',
        category: 'Social Welfare',
        short_description: 'Geriatric medical visits, monthly nutritional rations, companionship and legal rights awareness.',
        full_description: 'Providing dignified care to vulnerable and abandoned senior citizens through regular doctor checkups, essential medicines, and emotional support networks.',
        cover_image: '/senior-care.jpg',
        location: 'Hyderabad',
        status: 'Published',
        featured: 0
      },
      {
        title: 'Support for Persons with Disabilities',
        slug: 'support-persons-with-disabilities',
        category: 'Special Care',
        short_description: 'Mobility aid distribution (wheelchairs, tricycles), inclusive education support and therapy referrals.',
        full_description: 'Enabling dignity and mobility for differently-abled individuals through assistive aids, skill training tailored for accessibility, and community inclusion campaigns.',
        cover_image: '/disability-support.jpg',
        location: 'Telangana',
        status: 'Published',
        featured: 0
      },
      {
        title: 'Environment & Tree Plantation',
        slug: 'environment-tree-plantation',
        category: 'Environment',
        short_description: 'Native tree plantation drives, school green clubs, water conservation awareness and plastic cleanups.',
        full_description: 'Combating climate change and greening public spaces through massive afforestation drives, rain-water harvesting workshops, and eco-friendly citizen movements.',
        cover_image: '/tree-plantation.jpg',
        location: 'Parks, Roads & Village Commons',
        status: 'Published',
        featured: 0
      },
      {
        title: 'Disaster & Emergency Support',
        slug: 'disaster-emergency-support',
        category: 'Emergency Relief',
        short_description: 'Rapid response relief packs, emergency shelter items, medical first-response and rehabilitation support.',
        full_description: 'Immediate relief teams mobilized during floods, fires, cyclones, and humanitarian emergencies with dry rations, tarpaulins, clean water, and medical aid.',
        cover_image: '/emergency-relief.jpg',
        location: 'Disaster-Prone Regions',
        status: 'Published',
        featured: 0
      },
      {
        title: 'Food & Essential-Needs Assistance',
        slug: 'food-essential-needs',
        category: 'Hunger Relief',
        short_description: 'Community kitchens, festive grocery kits, hunger mitigation and warm blanket drives in winter.',
        full_description: 'Zero-hunger program delivering hot cooked meals to hospital attendants, homeless individuals, and monthly grocery hampers to widowed and impoverished households.',
        cover_image: '/food-drive.jpg',
        location: 'Slum Settlements & Public Hospitals',
        status: 'Published',
        featured: 1
      },
      {
        title: 'Community Unity & Social Welfare',
        slug: 'community-unity-social-welfare',
        category: 'Social Welfare',
        short_description: 'Inter-faith peace forums, youth sports festivals, legal aid camps and civic awareness drives.',
        full_description: 'Promoting mutual harmony, civic responsibility, and united social progress through community peace committees, cultural dialogue, and neighborhood solidarity.',
        cover_image: '/community-unity.jpg',
        location: 'Telangana & Beyond',
        status: 'Published',
        featured: 0
      }
    ];

    for (const p of programs) {
      await conn.query(
        `INSERT INTO programs (title, slug, category, short_description, full_description, cover_image, location, status, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
           title = VALUES(title), 
           category = VALUES(category), 
           short_description = VALUES(short_description),
           full_description = VALUES(full_description),
           status = VALUES(status),
           featured = VALUES(featured)`,
        [p.title, p.slug, p.category, p.short_description, p.full_description, p.cover_image, p.location, p.status, p.featured]
      );
    }

    // 3. Seed Realistic Volunteers
    console.log('🤝 Seeding Volunteers...');
    const volunteers = [
      ['TOGU-VOL-1001', 'Arjun Sharma', 'arjun.sharma@example.com', '+91 98761 12345', 'Balanagar Colony', 'Hyderabad', 'Telangana', 'Healthcare, Medical Camps', 'First Aid, Pharmacist assistance', 'Approved', 'Registered pharmacist, willing to coordinate weekend medical camps.'],
      ['TOGU-VOL-1002', 'Priya Rao', 'priya.rao@example.com', '+91 98452 67890', 'Jubilee Enclave', 'Hyderabad', 'Telangana', 'Education & Student Support', 'English teaching, curriculum planning', 'Approved', 'School teacher, can conduct evening tutoring.'],
      ['TOGU-VOL-1003', 'Mohammad Tariq', 'tariq.m@example.com', '+91 97003 44556', 'Charminar Road', 'Hyderabad', 'Telangana', 'Disaster Relief, Food Drive', 'Logistics, driving, crowd management', 'Pending', 'Applied online via website form. Needs phone verification.'],
      ['TOGU-VOL-1004', 'Sneha Patel', 'sneha.p@example.com', '+91 99123 77889', 'Kukatpally Phase 2', 'Hyderabad', 'Telangana', 'Women Empowerment', 'Stitching trainer, counselor', 'Approved', 'Can lead weekend tailoring workshops.']
    ];

    for (const v of volunteers) {
      await conn.query(
        `INSERT INTO volunteers (volunteer_id, full_name, email, phone, address, city, state, areas_of_interest, skills, status, admin_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), status = VALUES(status)`,
        v
      );
    }

    // 4. Seed Realistic Enquiries
    console.log('📬 Seeding Enquiries...');
    const enquiries = [
      ['TOGU-ENQ-2001', 'Dr. Ramesh Kumar', 'dr.ramesh@apollohospital.org', '+91 98490 11223', 'Partnership for Free Eye Camp', 'We would like to partner with TOGU Foundation to conduct a free cataract screening and eye care camp in rural Medak district next month.', 'In Progress', 'Discussed initial dates. Coordinating with Dr. Ramesh for venue permission.'],
      ['TOGU-ENQ-2002', 'Fatima Begum', 'fatima.b88@gmail.com', '+91 99887 66554', 'Assistance for daughter scholarship', 'Respected Sir, my daughter scored 94% in SSC exams. We request financial assistance for her 11th class science stream admission fees.', 'New', 'Needs income certificate verification.'],
      ['TOGU-ENQ-2003', 'Vikramaditya Verma', 'vverma@techcorp.in', '+91 98111 22334', 'CSR Donation Query', 'Our company is looking to allocate FY26 CSR funds towards healthcare diagnostics in underserved communities. Please share 80G and foundation profile.', 'Resolved', 'Shared 80G certificate, registration profile and proposal document on email.']
    ];

    for (const e of enquiries) {
      await conn.query(
        `INSERT INTO enquiries (enquiry_id, name, email, phone, subject, message, status, internal_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status)`,
        e
      );
    }

    // 5. Seed Realistic Members
    console.log('🎖️ Seeding Members...');
    const members = [
      ['TOGU-MEM-001', 'Syed Zahoor Ahmad', 'zahoor@togufoundation.org', '+91 98765 00001', 'Hyderabad, Telangana', 'Founder & President', '2023-01-15', 'Active', 'Founder Trustee and visionary behind TOGU Foundation.'],
      ['TOGU-MEM-002', 'K. Venkat Reddy', 'k.venkat@reddyenterprises.com', '+91 98480 33445', 'Balanagar, Hyderabad', 'Life Member', '2023-03-20', 'Active', 'Philanthropist and core patron for medical initiatives.'],
      ['TOGU-MEM-003', 'Ananya Deshmukh', 'ananya.d@gmail.com', '+91 97011 88990', 'Banjara Hills, Hyderabad', 'Youth Wing Leader', '2024-02-10', 'Active', 'Coordinating university campus volunteer chapters.']
    ];

    for (const m of members) {
      await conn.query(
        `INSERT INTO members (membership_id, full_name, email, phone, address, membership_type, joining_date, status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), status = VALUES(status)`,
        m
      );
    }

    // 6. Seed Realistic Events
    console.log('📅 Seeding Events...');
    const events = [
      ['TOGU-EVT-101', 'Mega Rural Health & Diagnostics Camp', 'Free blood tests, general physician consultation, ECG, diabetes check, and free medicines for 500+ rural residents.', '/healthcare-camp.jpg', '2026-11-15', '09:00 AM', '04:00 PM', 'Zilla Parishad High School, Medak District', 'Published'],
      ['TOGU-EVT-102', 'Annual Student Scholarship Award Ceremony', 'Distribution of merit scholarships and educational aid kits to 150 underprivileged high-school students.', '/education.jpg', '2026-11-28', '10:30 AM', '01:30 PM', 'Community Hall, Balanagar, Hyderabad', 'Published'],
      ['TOGU-EVT-103', 'Green Earth 5000 Tree Plantation Drive', 'Massive volunteer-led tree plantation drive in collaboration with local school eco-clubs.', '/tree-plantation.jpg', '2026-10-02', '07:30 AM', '11:30 AM', 'Lakefront Park, Nizamabad Highway', 'Published']
    ];

    for (const ev of events) {
      await conn.query(
        `INSERT INTO events (event_id, title, description, cover_image, event_date, start_time, end_time, location, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), status = VALUES(status)`,
        ev
      );
    }

    // 7. Seed Realistic Donations
    console.log('💰 Seeding Verified Donations...');
    const donations = [
      ['TOGU-DON-5001', 'K. Venkat Reddy', 'k.venkat@reddyenterprises.com', '+91 98480 33445', 100000.00, 'INR', '2026-09-15', 'Bank Transfer', 'NEFT-HDFC-99882211', 'Successful', 'REC-2026-0901', 'Major contribution for rural mobile health van equipment.'],
      ['TOGU-DON-5002', 'Global Hope Foundation India', 'donations@globalhope.org', '+91 11 4567 8900', 250000.00, 'INR', '2026-08-20', 'Bank Transfer', 'RTGS-SBI-44332211', 'Successful', 'REC-2026-0802', 'Grant for student scholarship kits.'],
      ['TOGU-DON-5003', 'Sunil Narang', 'sunil.narang@yahoo.co.in', '+91 98220 55667', 15000.00, 'INR', '2026-10-01', 'UPI', 'UPI-9822055667@okicici', 'Successful', 'REC-2026-1003', 'General donation for healthcare medicine distribution.'],
      ['TOGU-DON-5004', 'Anonymous Donor', 'contact@togufoundation.org', '+91 98000 00000', 5000.00, 'INR', '2026-10-12', 'UPI', 'UPI-TXN-10129988', 'Pending', 'REC-2026-1004', 'Online donation pledge verification pending with bank.']
    ];

    for (const d of donations) {
      await conn.query(
        `INSERT INTO donations (donation_id, donor_name, donor_email, donor_phone, amount, currency, donation_date, payment_method, transaction_id, payment_status, receipt_number, internal_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE donor_name = VALUES(donor_name), payment_status = VALUES(payment_status)`,
        d
      );
    }

    // 8. Seed Realistic Expenses
    console.log('🧾 Seeding Expenses...');
    const expenses = [
      ['TOGU-EXP-7001', 'Bulk Purchase of Antibiotics & Essential Medicines', 'Medical Camps', 42500.00, '2026-09-28', 'Bank Transfer', 'MedPlus Wholesale Distributors', 'Medicines for upcoming 2 rural health camps.'],
      ['TOGU-EXP-7002', '150 School Bags and Stationery Sets', 'Education Supplies', 38000.00, '2026-09-10', 'Bank Transfer', 'Vidyarthi Book Depot, Hyderabad', 'School kits distributed during back-to-school drive.'],
      ['TOGU-EXP-7003', 'Dry Grocery Packs for 100 Families', 'Food Distribution', 45000.00, '2026-10-05', 'Cheque', 'Annapurna Grocery Wholesale', 'Monthly ration kits distributed to widowed and destitute families.']
    ];

    for (const ex of expenses) {
      await conn.query(
        `INSERT INTO expenses (expense_id, title, category, amount, expense_date, payment_method, vendor_recipient, description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), amount = VALUES(amount)`,
        ex
      );
    }

    // 9. Seed Website Content
    console.log('🌐 Seeding Website Content...');
    const contentSections = [
      {
        key: 'hero',
        title: 'Hero Banner Section',
        content: {
          tagline: 'Empowering Communities • Transforming Lives',
          title: 'TOGU FOUNDATION',
          subtitle: 'Together for Good. United for Change.',
          description: 'A non-profit organization dedicated to building an inclusive and empowered society through sustainable development, quality healthcare, education, and human dignity.',
          ctaPrimaryText: 'Donate Now',
          ctaPrimaryLink: '/donate',
          ctaSecondaryText: 'Explore Programs',
          ctaSecondaryLink: '/#focus-areas',
          sliderImages: [
            '/hero-1.jpg',
            '/hero-2.jpg',
            '/hero-3.jpg',
            '/hero-4.jpg'
          ]
        }
      },
      {
        key: 'about',
        title: 'About Foundation Section',
        content: {
          badge: 'About TOGU Foundation',
          heading: 'Dedicated to Compassion, Equality & Lasting Change',
          paragraph1: 'TOGU Foundation is a registered non-profit organization established with the conviction that sustainable social change is born from grassroots empowerment, accessible healthcare, and equal educational opportunity.',
          paragraph2: 'We work directly with vulnerable families, marginalized communities, and passionate volunteers to deliver high-impact programs that bring measurable improvements in living standards, healthcare access, and self-reliance.',
          vision: 'To build a self-reliant, inclusive and compassionate society where every individual has access to healthcare, education, and opportunities to thrive with dignity.',
          mission: 'Empowering underserved communities through sustainable health interventions, educational support, vocational training, and transparent social welfare initiatives.'
        }
      },
      {
        key: 'contact_info',
        title: 'Contact Information',
        content: {
          address: 'Balanagar, Hyderabad, Telangana - 500037, India',
          phone: '+91 98765 43210',
          email: 'contact@togufoundation.org',
          supportEmail: 'info@togufoundation.org',
          officeHours: 'Monday - Saturday: 9:30 AM - 6:30 PM',
          facebook: 'https://facebook.com/togufoundation',
          twitter: 'https://twitter.com/togufoundation',
          instagram: 'https://instagram.com/togufoundation',
          linkedin: 'https://linkedin.com/company/togufoundation'
        }
      },
      {
        key: 'impact_stats',
        title: 'Impact Statistics',
        content: {
          livesTouched: '25,000+',
          healthCampsOrganized: '85+',
          scholarshipsAwarded: '1,200+',
          villagesReached: '40+'
        }
      }
    ];

    for (const c of contentSections) {
      await conn.query(
        `INSERT INTO website_content (section_key, title, content, status)
         VALUES (?, ?, ?, 'Published')
         ON DUPLICATE KEY UPDATE title = VALUES(title), content = VALUES(content)`,
        [c.key, c.title, JSON.stringify(c.content)]
      );
    }

    // 10. Seed Team Members (Real Founder profile from site)
    console.log('👥 Seeding Team Members...');
    const team = [
      ['Syed Zahoor Ahmad', 'Founder & President', 'Founder', '/logo-icon.png', 'Visionary social leader and founder dedicated to uplifting underserved communities through healthcare, educational support and sustainable livelihood initiatives.', 1, 1],
      ['Managing Trustee', 'Trustee & Legal Advisor', 'Trustee', '/logo-icon.png', 'Guiding governance, regulatory compliance, and community partnerships.', 2, 1],
      ['Dr. Medical Director', 'Head of Healthcare Initiatives', 'Executive', '/logo-icon.png', 'Leading rural health diagnostics, medical camps, and healthcare professional volunteers.', 3, 1]
    ];

    for (const tm of team) {
      await conn.query(
        `INSERT INTO team_members (name, designation, role_type, photo, bio, display_order, is_published)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name), designation = VALUES(designation)`,
        tm
      );
    }

    // 11. Initial Activity Log
    await conn.query(
      `INSERT INTO activity_logs (actor_name, action, record_type, details)
       VALUES (?, ?, ?, ?)`,
      ['System Seed', 'SEED_DATABASE', 'SYSTEM', 'Initial database tables, super admin, programs, content and sample verified records seeded successfully.']
    );

    await conn.commit();
    console.log('✅ TOGU Foundation Database Seeded Successfully!');
    console.log('\n=============================================');
    console.log('🔑 SUPER ADMIN CREDENTIALS:');
    console.log('Email:    admin@togufoundation.org');
    console.log('Password: togu@2026');
    console.log('Role:     Super Admin');
    console.log('=============================================\n');

  } catch (err) {
    await conn.rollback();
    console.error('❌ Seeding Failed:', err);
    throw err;
  } finally {
    conn.release();
    process.exit(0);
  }
}

seedDatabase();
