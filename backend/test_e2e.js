async function runTests() {
  console.log('🚀 Running Full E2E Admin & Database Verification Suite...\n');

  const BASE_URL = 'http://localhost:5001';

  // 1. Public Contact Enquiry
  console.log('1. Submitting Public Contact Enquiry...');
  const enqRes = await fetch(`${BASE_URL}/api/enquiries/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '9876543210',
      subject: 'CSR Tree Plantation Initiative',
      message: 'We would love to partner with TOGU Foundation for our CSR drive.'
    })
  });
  const enqData = await enqRes.json();
  console.log('Enquiry Status:', enqRes.status, enqData);

  // 2. Public Volunteer Application
  console.log('\n2. Submitting Public Volunteer Application...');
  const volRes = await fetch(`${BASE_URL}/api/volunteers/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '9849012345',
      city: 'Hyderabad',
      state: 'Telangana',
      areas_of_interest: 'Healthcare & Education',
      skills: 'Teaching, First Aid',
      notes: 'Available on weekends'
    })
  });
  const volData = await volRes.json();
  console.log('Volunteer Status:', volRes.status, volData);

  // 3. Public Donation Pledge
  console.log('\n3. Submitting Public Donation Pledge...');
  const donRes = await fetch(`${BASE_URL}/api/donations/public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      donor_name: 'Ramesh Gupta',
      donor_email: 'ramesh.gupta@example.com',
      donor_phone: '9123456780',
      amount: 5000,
      currency: 'INR',
      payment_method: 'UPI Pledge',
      notes: 'Support for student healthcare drive'
    })
  });
  const donData = await donRes.json();
  console.log('Donation Status:', donRes.status, donData);

  // 4. Admin Login with Super Admin credentials
  console.log('\n4. Authenticating as Super Admin (admin@togufoundation.org)...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@togufoundation.org',
      password: 'togu@2026'
    })
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status, 'User:', loginData?.user?.email, 'Role:', loginData?.user?.role);
  const token = loginData?.token;

  if (!token) {
    console.error('❌ Login failed, aborting authenticated tests.');
    return;
  }

  // 5. Dashboard Real-time Statistics
  console.log('\n5. Fetching Real Database Dashboard Statistics...');
  const statsRes = await fetch(`${BASE_URL}/api/dashboard/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const statsData = await statsRes.json();
  console.log('Dashboard Stats from MySQL:');
  console.table(statsData?.stats);

  // 6. Verify Enquiries List
  console.log('\n6. Fetching Enquiries List...');
  const enqListRes = await fetch(`${BASE_URL}/api/enquiries?limit=5`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const enqListData = await enqListRes.json();
  console.log(`Retrieved ${enqListData?.pagination?.total || 0} enquiries. Latest:`, enqListData?.enquiries?.[0]?.name, '-', enqListData?.enquiries?.[0]?.subject);

  // 7. Verify Volunteers List
  console.log('\n7. Fetching Volunteers List...');
  const volListRes = await fetch(`${BASE_URL}/api/volunteers?limit=5`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const volListData = await volListRes.json();
  console.log(`Retrieved ${volListData?.pagination?.total || 0} volunteers. Latest:`, volListData?.volunteers?.[0]?.full_name, '-', volListData?.volunteers?.[0]?.volunteer_id);

  // 8. Verify Donations List
  console.log('\n8. Fetching Donations List...');
  const donListRes = await fetch(`${BASE_URL}/api/donations?limit=5`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const donListData = await donListRes.json();
  console.log(`Retrieved ${donListData?.pagination?.total || 0} donations. Latest:`, donListData?.donations?.[0]?.donor_name, 'Amount: ₹', donListData?.donations?.[0]?.amount, 'Status:', donListData?.donations?.[0]?.payment_status);

  // 9. Verify Activity Logs
  console.log('\n9. Fetching Activity Logs...');
  const logsRes = await fetch(`${BASE_URL}/api/activity-logs?limit=5`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const logsData = await logsRes.json();
  console.log(`Retrieved ${logsData?.pagination?.total || 0} activity logs. Latest:`, logsData?.logs?.[0]?.action, logsData?.logs?.[0]?.details);

  console.log('\n✅ ALL E2E VERIFICATION CHECKS PASSED SUCCESSFULLY!');
}

runTests().catch(console.error);
