// Create this as: src/components/DebugTest.js
import React, { useEffect, useState } from 'react';

const DebugTest = () => {
  const [debugResults, setDebugResults] = useState([]);
  
  const addResult = (message) => {
    setDebugResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    const runDebugTests = async () => {
      addResult('🧪 INSTAMOJO INTEGRATION DEBUG TEST STARTING...\n');
      
      // Test 1: Environment Variables
      addResult('1️⃣ Environment Variables:');
      addResult(`   API URL: ${process.env.REACT_APP_API_BASE_URL || 'MISSING - Should be http://localhost:5001'}`);
      addResult(`   Instamojo API Key: ${process.env.REACT_APP_INSTAMOJO_API_KEY || 'MISSING - Should start with test_'}`);
      addResult(`   Node Env: ${process.env.NODE_ENV || 'MISSING'}`);
      
      // Test 2: Backend Connection
      addResult('\n2️⃣ Testing Backend Connection...');
      const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
      
      try {
        addResult(`   Attempting connection to: ${API_URL}/api/test`);
        const response = await fetch(`${API_URL}/api/test`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        addResult(`   Response Status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          addResult(`   ✅ Backend connection SUCCESS`);
          addResult(`   Backend Message: ${data.message}`);
          addResult(`   Instamojo Config: ${JSON.stringify(data.instamojo || {})}`);
        } else {
          const errorText = await response.text();
          addResult(`   ❌ Backend responded with error: ${response.status} ${response.statusText}`);
          addResult(`   Error details: ${errorText}`);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Test 3: Test Payment Request Creation
        addResult('\n3️⃣ Testing Payment Request Creation...');
        const orderResponse = await fetch(`${API_URL}/api/donations/create-order`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 100,
            donorDetails: {
              name: 'Test User',
              email: 'test@example.com',
              phone: '9999999999',
              address: 'Test Address',
              city: 'Test City',
              pincode: '123456',
              cause: 'general'
            }
          })
        });
        
        addResult(`   Payment Request Response Status: ${orderResponse.status}`);
        
        if (orderResponse.ok) {
          const orderData = await orderResponse.json();
          addResult(`   ✅ Payment request creation SUCCESS`);
          addResult(`   Payment Request ID: ${orderData.paymentRequestId || 'Not provided'}`);
          addResult(`   Payment URL: ${orderData.longUrl ? 'Generated' : 'Missing'}`);
        } else {
          const errorText = await orderResponse.text();
          addResult(`   ❌ Payment request creation FAILED: ${orderResponse.status}`);
          addResult(`   Error: ${errorText}`);
        }
        
      } catch (error) {
        addResult(`\n❌ CRITICAL ERROR DETECTED: ${error.message}`);
        addResult('\n🔧 TROUBLESHOOTING STEPS:');
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          addResult('   CAUSE: Cannot connect to backend server');
          addResult('   SOLUTIONS:');
          addResult('   1. Make sure backend is running: cd server && node server.js');
          addResult('   2. Check if port 5001 is available');
          addResult('   3. Verify backend URL in .env: REACT_APP_API_BASE_URL=http://localhost:5001');
          addResult('   4. Check firewall/antivirus blocking connections');
        } else if (error.message.includes('CORS')) {
          addResult('   CAUSE: Cross-origin request blocked');
          addResult('   SOLUTIONS:');
          addResult('   1. Restart backend server');
          addResult('   2. Check CORS configuration in server.js');
        } else if (error.message.includes('500')) {
          addResult('   CAUSE: Backend server error');
          addResult('   SOLUTIONS:');
          addResult('   1. Check backend console for errors');
          addResult('   2. Verify Instamojo credentials in .env');
          addResult('   3. Check if all dependencies are installed: npm install axios crypto');
        } else {
          addResult('   CAUSE: Unknown error');
          addResult('   SOLUTIONS:');
          addResult('   1. Check browser console for more details');
          addResult('   2. Verify all environment variables are set');
          addResult('   3. Try refreshing the page');
        }
        
        addResult('\n📋 CURRENT CONFIGURATION:');
        addResult(`   Frontend URL: ${window.location.origin}`);
        addResult(`   Backend URL: ${API_URL}`);
        addResult(`   API Key Present: ${process.env.REACT_APP_INSTAMOJO_API_KEY ? 'YES' : 'NO'}`);
      }
      
      // Test 4: Network Connectivity
      addResult('\n4️⃣ Testing Network Connectivity...');
      try {
        const networkTest = await fetch('https://httpbin.org/get', { 
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        if (networkTest.ok) {
          addResult('   ✅ Internet connection working');
        }
      } catch (networkError) {
        addResult('   ❌ Network connectivity issues detected');
        addResult(`   Network Error: ${networkError.message}`);
      }
      
      addResult('\n🎉 DEBUG TEST COMPLETED!');
      addResult('\n📋 SUMMARY:');
      addResult('   If you see errors above, follow the troubleshooting steps');
      addResult('   If all tests pass, try the donation flow again');
      addResult('   For further help, share this debug log with support');
    };
    
    runDebugTests();
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'monospace', 
      backgroundColor: '#f5f5f5',
      whiteSpace: 'pre-wrap',
      maxHeight: '500px',
      overflow: 'auto',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2 style={{ color: '#16a34a', marginBottom: '20px' }}>
        🔧 Instamojo Integration Debug Test
      </h2>
      {debugResults.map((result, index) => (
        <div key={index} style={{ 
          marginBottom: '2px', 
          color: result.includes('❌') ? '#dc2626' : result.includes('✅') ? '#16a34a' : '#374151'
        }}>
          {result}
        </div>
      ))}
    </div>
  );
};

export default DebugTest;