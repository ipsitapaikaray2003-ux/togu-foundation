import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'local_data.json');

// Default initial data if database file does not exist
function getDefaultData() {
  return {
    admin_users: [
      {
        id: 1,
        name: 'Super Admin',
        email: 'admin@togufoundation.org',
        password: '$2b$10$7AXLfQeFoyg8LlUzEoc/ROwMNpTUavqosOCpWOEeJ20s1algcCs4a', // togu@2026
        role: 'Super Admin',
        status: 'Active',
        phone: '+91 98765 43210',
        avatar: null,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Operations Manager',
        email: 'manager@togufoundation.org',
        password: '$2b$10$7AXLfQeFoyg8LlUzEoc/ROwMNpTUavqosOCpWOEeJ20s1algcCs4a', // togu@2026
        role: 'Admin',
        status: 'Active',
        phone: '+91 98765 43211',
        avatar: null,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Field Coordinator',
        email: 'staff@togufoundation.org',
        password: '$2b$10$7AXLfQeFoyg8LlUzEoc/ROwMNpTUavqosOCpWOEeJ20s1algcCs4a', // togu@2026
        role: 'Staff',
        status: 'Active',
        phone: '+91 98765 43212',
        avatar: null,
        created_at: new Date().toISOString()
      }
    ],
    programs: [
      {
        id: 1,
        title: 'Healthcare & Health Awareness',
        slug: 'healthcare-health-awareness',
        category: 'Healthcare',
        short_description: 'Free medical check-up camps, rural diagnostic drives, medicine distribution and preventive health workshops.',
        full_description: 'Our healthcare mission brings qualified doctors and free medical check-ups directly to underserved rural and urban slum communities. We provide essential medicines, pediatric care, eye check-ups, and health education to thousands in need.',
        cover_image: '/healthcare-camp.jpg',
        location: 'Hyderabad & Rural Telangana',
        status: 'Published',
        featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Education & Student Support',
        slug: 'education-student-support',
        category: 'Education',
        short_description: 'Scholarships, school kit distribution, tuition support and digital literacy for underprivileged students.',
        full_description: 'Ensuring that no child is forced to drop out of school due to financial hardship. We distribute school supplies, bridge learning gaps, and support higher education for deserving students.',
        cover_image: '/education.jpg',
        location: 'Telangana & Andhra Pradesh',
        status: 'Published',
        featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Women Empowerment',
        slug: 'women-empowerment',
        category: 'Livelihood',
        short_description: 'Self-help groups, vocational tailoring courses, financial literacy and micro-enterprise mentorship.',
        full_description: 'Empowering rural women with vocational training, tailoring centers, financial literacy, and entrepreneurship skills to build financially independent livelihoods.',
        cover_image: '/women-empowerment.jpg',
        location: 'Balanagar & Surrounding Districts',
        status: 'Published',
        featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Youth Skill Development',
        slug: 'youth-skill-development',
        category: 'Education',
        short_description: 'Computer software training, spoken English classes and interview readiness for underprivileged youth.',
        full_description: 'Equipping rural and urban youth with high-demand digital skills, coding fundamentals, spoken English, and job-placement assistance.',
        cover_image: '/youth-skills.jpg',
        location: 'Hyderabad Tech Center',
        status: 'Published',
        featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Elderly & Senior Care',
        slug: 'elderly-senior-care',
        category: 'Healthcare',
        short_description: 'Monthly nutritional rations, free medicines, companionship and geriatric healthcare for vulnerable seniors.',
        full_description: 'Providing dignity, care, and healthcare support to abandoned and destitute elderly citizens.',
        cover_image: '/elderly-care.jpg',
        location: 'Old Age Homes & Day Care Centers',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Child Welfare & Nutrition',
        slug: 'child-welfare-nutrition',
        category: 'Nutrition',
        short_description: 'Daily supplementary nutrition, mid-day meals, immunity supplements and health checkups in slums.',
        full_description: 'Combating child malnutrition in urban slums and rural hamlets through balanced nutrition kits, clean drinking water, and pediatric monitoring.',
        cover_image: '/child-nutrition.jpg',
        location: 'Community Centers',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 7,
        title: 'Environmental Conservation',
        slug: 'environmental-conservation',
        category: 'Environment',
        short_description: 'Tree plantation drives, plastic-free neighborhood awareness, and groundwater recharge initiatives.',
        full_description: 'Protecting our local ecosystems through large-scale sapling plantations, waste segregation workshops, and clean village campaigns.',
        cover_image: '/environment.jpg',
        location: 'Various Rural & Urban Locations',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 8,
        title: 'Clean Drinking Water (Jal Seva)',
        slug: 'clean-drinking-water',
        category: 'Healthcare',
        short_description: 'Community RO water filtration plants in arsenic and fluoride affected rural villages.',
        full_description: 'Installing sustainable, community-maintained reverse osmosis drinking water kiosks in rural villages facing contaminated groundwater.',
        cover_image: '/water-plant.jpg',
        location: 'Rural Communities',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 9,
        title: 'Disaster Relief & Emergency Aid',
        slug: 'disaster-relief-emergency-aid',
        category: 'Emergency',
        short_description: 'Rapid response food packets, temporary shelters, blankets and medical aid during floods and crises.',
        full_description: 'Rapid-response emergency task force delivering immediate relief supplies, hot meals, hygiene kits, and rebuilding support during natural disasters.',
        cover_image: '/disaster-relief.jpg',
        location: 'Crisis-Affected Regions',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 10,
        title: 'Differently-Abled Support',
        slug: 'differently-abled-support',
        category: 'Healthcare',
        short_description: 'Wheelchairs, prosthetic aids, braille literacy kits and barrier-free vocational coaching.',
        full_description: 'Enabling persons with disabilities with assistive devices, mobility aids, specialized vocational coaching, and equal societal opportunities.',
        cover_image: '/differently-abled.jpg',
        location: 'Regional Rehabilitation Centers',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 11,
        title: 'Rural Infrastructure & Solar Lighting',
        slug: 'rural-infrastructure-solar',
        category: 'Community',
        short_description: 'Solar street lights in un-electrified tribal hamlets, community hall renovations and sanitation units.',
        full_description: 'Bringing sustainable solar streetlights and community sanitation infrastructure to remote tribal hamlets lacking grid connectivity.',
        cover_image: '/solar-rural.jpg',
        location: 'Tribal & Remote Villages',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 12,
        title: 'Legal Rights & Social Justice Advocacy',
        slug: 'legal-rights-advocacy',
        category: 'Advocacy',
        short_description: 'Free legal aid clinics, awareness on government welfare schemes and citizen documentation drives.',
        full_description: 'Providing free legal counseling, guidance on government beneficiary schemes, and helping citizens secure official identity documents.',
        cover_image: '/legal-aid.jpg',
        location: 'Community Legal Help Desks',
        status: 'Published',
        featured: 0,
        created_at: new Date().toISOString()
      }
    ],
    events: [
      {
        id: 1,
        event_id: 'EVT-2026-001',
        title: 'Free Mega Health & Eye Checkup Camp',
        description: 'Comprehensive general health checkups, blood tests, eye screening and free distribution of prescribed medicines for families in need.',
        cover_image: '/healthcare-camp.jpg',
        event_date: '2026-11-15',
        start_time: '09:00 AM',
        end_time: '04:00 PM',
        location: 'Community Center, Balanagar, Hyderabad',
        status: 'Published',
        program_id: 1,
        is_archived: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        event_id: 'EVT-2026-002',
        title: 'Student Education Kit & Scholarship Drive',
        description: 'Distributing complete school bags, notebooks, stationery kits and merit scholarships to 500+ government school students.',
        cover_image: '/education.jpg',
        event_date: '2026-11-28',
        start_time: '10:00 AM',
        end_time: '02:00 PM',
        location: 'Government High School Grounds, Medchal',
        status: 'Published',
        program_id: 2,
        is_archived: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        event_id: 'EVT-2026-003',
        title: 'Women Self-Help & Tailoring Graduation',
        description: 'Ceremony awarding free sewing machines and completion certificates to 60 rural women graduating from our tailoring cohort.',
        cover_image: '/women-empowerment.jpg',
        event_date: '2026-12-10',
        start_time: '11:00 AM',
        end_time: '03:00 PM',
        location: 'TOGU Livelihood Center, Hyderabad',
        status: 'Published',
        program_id: 3,
        is_archived: 0,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        event_id: 'EVT-2026-004',
        title: 'Youth Digital Literacy & Placement Workshop',
        description: 'Hands-on IT skills bootcamp covering MS Office, resume writing, mock interviews, and direct interviews with hiring partners.',
        cover_image: '/youth-skills.jpg',
        event_date: '2026-12-22',
        start_time: '09:30 AM',
        end_time: '05:00 PM',
        location: 'Tech Learning Hub, Secunderabad',
        status: 'Published',
        program_id: 4,
        is_archived: 0,
        created_at: new Date().toISOString()
      }
    ],
    website_content: [
      {
        id: 1,
        section_key: 'hero',
        title: 'HERO SECTION',
        content: {
          title: 'Empowering Communities, Transforming Lives',
          subtitle: 'TOGU Foundation is committed to grassroots upliftment through healthcare access, quality education, youth livelihood, and holistic rural development.',
          primaryCtaText: 'Donate Now',
          primaryCtaLink: '/donate',
          secondaryCtaText: 'Explore Programs',
          secondaryCtaLink: '#programs',
          sliderImages: ['/hero.jpg', '/education.jpg', '/healthcare.jpg', '/women.jpg']
        },
        status: 'Published',
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        section_key: 'about',
        title: 'ABOUT SECTION',
        content: {
          badge: 'ABOUT TOGU FOUNDATION',
          heading: 'Dedicated to Grassroots Transformation',
          storyParagraph1: 'Founded with a deep mission to serve humanity, TOGU Foundation works at the grassroots level to bring meaningful change to underprivileged families across Telangana and Andhra Pradesh.',
          storyParagraph2: 'From free diagnostic medical camps to educational scholarships, our team and volunteers work tirelessly every day to ensure that every individual has the opportunity to live with health, education, and dignity.',
          vision: 'To build a compassionate, equitable society where every individual has access to quality healthcare, empowering education, and sustainable livelihoods.',
          mission: 'To serve underprivileged communities with transparency, grassroots action, and community participation through dedicated health, education, and welfare drives.',
          values: ['Integrity & Transparency', 'Community-First Action', 'Empowerment through Education', 'Compassion in Care']
        },
        status: 'Published',
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        section_key: 'contact_info',
        title: 'CONTACT INFO',
        content: {
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
        },
        status: 'Published',
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        section_key: 'impact_stats',
        title: 'IMPACT STATS',
        content: {
          peopleSupported: '15,000+',
          medicalDrives: '120+',
          activeVolunteers: '350+',
          programsActive: '12 Focus Areas'
        },
        status: 'Published',
        updated_at: new Date().toISOString()
      }
    ],
    volunteers: [
      {
        id: 1,
        volunteer_id: 'VOL-2026-001',
        full_name: 'Priya Sharma',
        email: 'priya.s@example.com',
        phone: '+91 98765 11111',
        address: 'Balanagar, Hyderabad',
        city: 'Hyderabad',
        state: 'Telangana',
        areas_of_interest: 'Healthcare, Education',
        skills: 'First Aid, Teaching',
        status: 'Approved',
        admin_notes: 'Verified volunteer for health camps',
        is_archived: 0,
        created_at: new Date().toISOString()
      }
    ],
    enquiries: [
      {
        id: 1,
        enquiry_id: 'ENQ-2026-001',
        name: 'Rajesh Reddy',
        email: 'rajesh.reddy@example.com',
        phone: '+91 98765 22222',
        subject: 'Healthcare Camp Partnership',
        message: 'We would like to partner with TOGU Foundation for an upcoming medical camp in our village.',
        status: 'New',
        assigned_to: 1,
        internal_notes: '',
        is_archived: 0,
        created_at: new Date().toISOString()
      }
    ],
    members: [
      {
        id: 1,
        membership_id: 'MEM-2026-001',
        full_name: 'Dr. Srinivas Rao',
        email: 'srinivas.rao@example.com',
        phone: '+91 98765 33333',
        address: 'Kukatpally, Hyderabad',
        membership_type: 'Life Member',
        joining_date: '2026-01-10',
        status: 'Active',
        notes: 'Advisory Doctor for Healthcare Wing',
        is_archived: 0,
        created_at: new Date().toISOString()
      }
    ],
    donations: [
      {
        id: 1,
        donation_id: 'DON-2026-001',
        donor_name: 'Anand Kumar',
        donor_email: 'anand.k@example.com',
        donor_phone: '+91 98765 44444',
        amount: 25000,
        currency: 'INR',
        donation_date: '2026-02-15',
        payment_method: 'UPI',
        transaction_id: 'UPI983726194',
        payment_status: 'Successful',
        program_id: 1,
        receipt_number: 'REC-2026-001',
        internal_notes: 'Donation for medical kits',
        created_by: 1,
        is_archived: 0,
        created_at: new Date().toISOString()
      }
    ],
    expenses: [
      {
        id: 1,
        expense_id: 'EXP-2026-001',
        title: 'Medicine and Diagnostic Supplies',
        category: 'Medical Supplies',
        amount: 14500,
        expense_date: '2026-02-20',
        payment_method: 'Bank Transfer',
        vendor_recipient: 'Apollo Pharmacy Wholesale',
        program_id: 1,
        description: 'Essential medicines for Balanagar medical drive',
        receipt_file: null,
        created_by: 1,
        is_archived: 0,
        created_at: new Date().toISOString()
      }
    ],
    activity_logs: [
      {
        id: 1,
        user_id: 1,
        actor_name: 'Super Admin',
        action: 'System Deployment',
        record_type: 'System',
        record_id: 'BOOT-001',
        details: 'TOGU Foundation platform successfully deployed and synchronized.',
        ip_address: '127.0.0.1',
        created_at: new Date().toISOString()
      }
    ]
  };
}

class ResilientStore {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('⚠️ Could not load local_data.json, creating new default data store:', e.message);
    }
    const def = getDefaultData();
    this.saveData(def);
    return def;
  }

  saveData(dataToSave) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf8');
    } catch (e) {
      console.warn('⚠️ Could not write local_data.json:', e.message);
    }
  }

  // Universal resilient SQL query handler
  async query(sql, params = []) {
    const s = sql.trim().replace(/\s+/g, ' ');
    const sUpper = s.toUpperCase();

    // 1. SELECT queries
    if (sUpper.startsWith('SELECT')) {
      return this.handleSelect(s, sUpper, params);
    }

    // 2. INSERT queries
    if (sUpper.startsWith('INSERT')) {
      return this.handleInsert(s, sUpper, params);
    }

    // 3. UPDATE queries
    if (sUpper.startsWith('UPDATE')) {
      return this.handleUpdate(s, sUpper, params);
    }

    // 4. DELETE queries
    if (sUpper.startsWith('DELETE')) {
      return this.handleDelete(s, sUpper, params);
    }

    // Harmless DDL or setting statements (SET, CREATE, etc.)
    return [[], []];
  }

  handleSelect(sql, sqlUpper, params) {
    // Determine target table
    const tableMatch = sql.match(/FROM\s+[`']?([a-zA-Z0-9_]+)[`']?/i);
    const tableName = tableMatch ? tableMatch[1] : '';
    let rows = (this.data[tableName] || []).map(r => ({ ...r }));

    // COUNT / Aggregates
    if (sqlUpper.includes('COUNT(') || sqlUpper.includes('SUM(') || sqlUpper.includes('COALESCE(')) {
      if (tableName === 'admin_users') {
        return [[{ count: rows.length, cnt: rows.length }], []];
      }
      if (tableName === 'volunteers') {
        const pending = rows.filter(r => r.status === 'Pending' && !r.is_archived).length;
        return [[{ total: rows.length, count: rows.length, totalVolunteers: rows.length, pendingVolunteers: pending }], []];
      }
      if (tableName === 'enquiries') {
        const newCount = rows.filter(r => r.status === 'New' && !r.is_archived).length;
        return [[{ total: rows.length, count: rows.length, totalEnquiries: rows.length, newEnquiries: newCount }], []];
      }
      if (tableName === 'members') {
        return [[{ total: rows.length, count: rows.length, totalMembers: rows.length }], []];
      }
      if (tableName === 'programs') {
        return [[{ total: rows.length, count: rows.length, totalPrograms: rows.length }], []];
      }
      if (tableName === 'events') {
        const upcoming = rows.filter(r => r.event_date >= new Date().toISOString().split('T')[0] && !r.is_archived).length;
        return [[{ total: rows.length, count: rows.length, totalEvents: rows.length, upcomingEventsCount: upcoming }], []];
      }
      if (tableName === 'donations') {
        const totalAmount = rows.filter(r => r.payment_status === 'Successful' && !r.is_archived).reduce((acc, c) => acc + Number(c.amount || 0), 0);
        const pendingAmount = rows.filter(r => r.payment_status === 'Pending' && !r.is_archived).reduce((acc, c) => acc + Number(c.amount || 0), 0);
        return [[{ total: totalAmount, totalDonations: totalAmount, donationCount: rows.length, pendingDonations: pendingAmount }], []];
      }
      if (tableName === 'expenses') {
        const totalAmount = rows.filter(r => !r.is_archived).reduce((acc, c) => acc + Number(c.amount || 0), 0);
        return [[{ total: totalAmount, totalExpenses: totalAmount, expenseCount: rows.length }], []];
      }
      return [[{ count: rows.length, total: rows.length, totalVolunteers: rows.length, totalEnquiries: rows.length, totalMembers: rows.length, totalPrograms: rows.length, totalEvents: rows.length }], []];
    }

    // Specific Table Queries
    if (tableName === 'admin_users') {
      if (sqlUpper.includes('WHERE EMAIL = ?')) {
        const email = params[0]?.toLowerCase().trim();
        rows = rows.filter(u => u.email.toLowerCase() === email);
      } else if (sqlUpper.includes('WHERE ID = ?')) {
        const id = Number(params[0]);
        rows = rows.filter(u => u.id === id);
      }
    }

    if (tableName === 'programs') {
      if (sqlUpper.includes('WHERE STATUS = ?') || sqlUpper.includes("WHERE STATUS = 'PUBLISHED'")) {
        rows = rows.filter(p => p.status === 'Published');
      }
      if (sqlUpper.includes('WHERE SLUG = ?')) {
        const slug = params[0];
        rows = rows.filter(p => p.slug === slug);
      } else if (sqlUpper.includes('WHERE ID = ?')) {
        const id = Number(params[0]);
        rows = rows.filter(p => p.id === id);
      }
      // Sort featured first
      rows.sort((a, b) => (b.featured || 0) - (a.featured || 0));
    }

    if (tableName === 'events') {
      if (sqlUpper.includes('WHERE STATUS = ?') || sqlUpper.includes("WHERE STATUS = 'PUBLISHED'")) {
        rows = rows.filter(e => e.status === 'Published');
      }
      if (sqlUpper.includes('EVENT_DATE >=')) {
        const today = new Date().toISOString().split('T')[0];
        rows = rows.filter(e => e.event_date >= today && !e.is_archived);
      }
      if (sqlUpper.includes('WHERE ID = ?')) {
        const id = Number(params[0]);
        rows = rows.filter(e => e.id === id);
      }
      rows.sort((a, b) => a.event_date.localeCompare(b.event_date));
    }

    if (tableName === 'website_content') {
      if (sqlUpper.includes('SECTION_KEY = ?')) {
        const key = params[0];
        rows = rows.filter(c => c.section_key === key);
      }
    }

    if (tableName === 'volunteers' || tableName === 'enquiries' || tableName === 'members' || tableName === 'donations' || tableName === 'expenses') {
      if (sqlUpper.includes('WHERE ID = ?')) {
        const id = Number(params[0]);
        rows = rows.filter(r => r.id === id);
      } else {
        rows = rows.filter(r => !r.is_archived);
        rows.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      }
    }

    return [rows, []];
  }

  handleInsert(sql, sqlUpper, params) {
    const tableMatch = sql.match(/INSERT\s+INTO\s+[`']?([a-zA-Z0-9_]+)[`']?/i);
    const tableName = tableMatch ? tableMatch[1] : '';
    if (!this.data[tableName]) {
      this.data[tableName] = [];
    }

    const table = this.data[tableName];
    const newId = table.length > 0 ? Math.max(...table.map(r => r.id || 0)) + 1 : 1;

    let newRecord = { id: newId, created_at: new Date().toISOString() };

    // Website content ON DUPLICATE KEY UPDATE
    if (tableName === 'website_content') {
      const [key, title, contentJson] = params;
      const existingIdx = table.findIndex(c => c.section_key === key);
      const parsedContent = typeof contentJson === 'string' ? JSON.parse(contentJson) : contentJson;
      if (existingIdx !== -1) {
        table[existingIdx].content = parsedContent;
        table[existingIdx].title = title;
        table[existingIdx].updated_at = new Date().toISOString();
      } else {
        table.push({ id: newId, section_key: key, title, content: parsedContent, status: 'Published', updated_at: new Date().toISOString() });
      }
      this.saveData();
      return [{ insertId: newId, affectedRows: 1 }, []];
    }

    // Volunteers
    if (tableName === 'volunteers') {
      const [volunteer_id, full_name, email, phone, address, city, state, areas_of_interest, skills] = params;
      newRecord = {
        id: newId,
        volunteer_id: volunteer_id || `VOL-${Date.now()}`,
        full_name,
        email,
        phone,
        address,
        city,
        state,
        areas_of_interest,
        skills,
        status: 'Pending',
        is_archived: 0,
        created_at: new Date().toISOString()
      };
    }

    // Enquiries
    else if (tableName === 'enquiries') {
      const [enquiry_id, name, email, phone, subject, message] = params;
      newRecord = {
        id: newId,
        enquiry_id: enquiry_id || `ENQ-${Date.now()}`,
        name,
        email,
        phone,
        subject,
        message,
        status: 'New',
        is_archived: 0,
        created_at: new Date().toISOString()
      };
    }

    // Members
    else if (tableName === 'members') {
      const [membership_id, full_name, email, phone, address, membership_type, joining_date] = params;
      newRecord = {
        id: newId,
        membership_id: membership_id || `MEM-${Date.now()}`,
        full_name,
        email,
        phone,
        address,
        membership_type: membership_type || 'Regular',
        joining_date: joining_date || new Date().toISOString().split('T')[0],
        status: 'Active',
        is_archived: 0,
        created_at: new Date().toISOString()
      };
    }

    // Donations
    else if (tableName === 'donations') {
      const [donation_id, donor_name, donor_email, donor_phone, amount, currency, donation_date, payment_method, transaction_id, payment_status, program_id] = params;
      newRecord = {
        id: newId,
        donation_id: donation_id || `DON-${Date.now()}`,
        donor_name,
        donor_email,
        donor_phone,
        amount: Number(amount),
        currency: currency || 'INR',
        donation_date: donation_date || new Date().toISOString().split('T')[0],
        payment_method: payment_method || 'UPI',
        transaction_id: transaction_id || '',
        payment_status: payment_status || 'Successful',
        program_id: program_id || null,
        is_archived: 0,
        created_at: new Date().toISOString()
      };
    }

    // Events
    else if (tableName === 'events') {
      const [event_id, title, description, cover_image, event_date, start_time, end_time, location, program_id, status] = params;
      newRecord = {
        id: newId,
        event_id: event_id || `EVT-${Date.now()}`,
        title,
        description,
        cover_image,
        event_date,
        start_time,
        end_time,
        location,
        program_id,
        status: status || 'Published',
        is_archived: 0,
        created_at: new Date().toISOString()
      };
    }

    // Programs
    else if (tableName === 'programs') {
      const [title, slug, category, short_description, full_description, cover_image, location, status, featured] = params;
      newRecord = {
        id: newId,
        title,
        slug,
        category,
        short_description,
        full_description,
        cover_image,
        location,
        status: status || 'Published',
        featured: featured ? 1 : 0,
        created_at: new Date().toISOString()
      };
    }

    // Activity Logs
    else if (tableName === 'activity_logs') {
      const [user_id, actor_name, action, record_type, record_id, details, ip_address] = params;
      newRecord = {
        id: newId,
        user_id,
        actor_name,
        action,
        record_type,
        record_id,
        details,
        ip_address,
        created_at: new Date().toISOString()
      };
    }

    table.push(newRecord);
    this.saveData();
    return [{ insertId: newId, affectedRows: 1 }, []];
  }

  handleUpdate(sql, sqlUpper, params) {
    const tableMatch = sql.match(/UPDATE\s+[`']?([a-zA-Z0-9_]+)[`']?/i);
    const tableName = tableMatch ? tableMatch[1] : '';
    const table = this.data[tableName] || [];

    // Target ID is usually the last param in WHERE id = ?
    const targetId = Number(params[params.length - 1]);
    const idx = table.findIndex(r => r.id === targetId);

    if (idx !== -1) {
      if (sqlUpper.includes('LAST_LOGIN = NOW()')) {
        table[idx].last_login = new Date().toISOString();
      } else if (sqlUpper.includes('IS_ARCHIVED = 1')) {
        table[idx].is_archived = 1;
      } else if (tableName === 'enquiries' && sqlUpper.includes('STATUS = ?')) {
        table[idx].status = params[0];
        if (params.length > 2) table[idx].internal_notes = params[1];
      } else if (tableName === 'volunteers' && sqlUpper.includes('STATUS = ?')) {
        table[idx].status = params[0];
        if (params.length > 2) table[idx].admin_notes = params[1];
      } else if (tableName === 'members' && sqlUpper.includes('STATUS = ?')) {
        table[idx].status = params[0];
      }
      this.saveData();
    }

    return [{ affectedRows: idx !== -1 ? 1 : 0 }, []];
  }

  handleDelete(sql, sqlUpper, params) {
    const tableMatch = sql.match(/FROM\s+[`']?([a-zA-Z0-9_]+)[`']?/i);
    const tableName = tableMatch ? tableMatch[1] : '';
    const table = this.data[tableName] || [];
    const targetId = Number(params[params.length - 1]);
    const initialLen = table.length;
    this.data[tableName] = table.filter(r => r.id !== targetId);
    this.saveData();
    return [{ affectedRows: initialLen - this.data[tableName].length }, []];
  }
}

export const resilientStore = new ResilientStore();
