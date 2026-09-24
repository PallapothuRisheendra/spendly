const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`http://localhost:5000${path}`);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Starting API Verification Tests...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, name, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${name} ${details}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await request('GET', '/api/health');
    assert(health.status === 200 && health.data.success === true, 'GET /api/health');

    // 2. Login with Demo Account
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'demo@spendly.io',
      password: 'password123'
    });
    assert(loginRes.status === 200 && loginRes.data.token, 'POST /api/auth/login (demo account)');
    const token = loginRes.data.token;

    // 3. Auth Me
    const meRes = await request('GET', '/api/auth/me', null, token);
    assert(meRes.status === 200 && meRes.data.user.email === 'demo@spendly.io', 'GET /api/auth/me');

    // 4. Get Transactions
    const txRes = await request('GET', '/api/transactions', null, token);
    assert(txRes.status === 200 && Array.isArray(txRes.data.data), 'GET /api/transactions');

    // 5. Create Transaction
    const createTxRes = await request('POST', '/api/transactions', {
      type: 'expense',
      amount: 450,
      description: 'Coffee & Bagel',
      category: 'Food',
      paymentMethod: 'UPI'
    }, token);
    assert(createTxRes.status === 201 && createTxRes.data.data.amount === 450, 'POST /api/transactions');
    const newTxId = createTxRes.data.data?._id;

    // 6. Update Transaction
    if (newTxId) {
      const updateTxRes = await request('PUT', `/api/transactions/${newTxId}`, {
        amount: 500,
        description: 'Coffee & Pastry'
      }, token);
      assert(updateTxRes.status === 200 && updateTxRes.data.data.amount === 500, 'PUT /api/transactions/:id');

      // 7. Delete Transaction
      const delTxRes = await request('DELETE', `/api/transactions/${newTxId}`, null, token);
      assert(delTxRes.status === 200 && delTxRes.data.success === true, 'DELETE /api/transactions/:id');
    }

    // 8. Get Budgets
    const budgetsRes = await request('GET', '/api/budgets', null, token);
    assert(budgetsRes.status === 200 && Array.isArray(budgetsRes.data.data), 'GET /api/budgets');

    // 9. Create Budget
    const createBudgetRes = await request('POST', '/api/budgets', {
      category: 'Travel',
      amount: 15000,
      month: '2026-12'
    }, token);
    assert(createBudgetRes.status === 201 && createBudgetRes.data.data.category === 'Travel', 'POST /api/budgets');
    const newBudgetId = createBudgetRes.data.data?._id;

    // 10. Update Budget
    if (newBudgetId) {
      const updateBudgetRes = await request('PUT', `/api/budgets/${newBudgetId}`, {
        amount: 20000
      }, token);
      assert(updateBudgetRes.status === 200 && updateBudgetRes.data.data.amount === 20000, 'PUT /api/budgets/:id');

      // 11. Delete Budget
      const delBudgetRes = await request('DELETE', `/api/budgets/${newBudgetId}`, null, token);
      assert(delBudgetRes.status === 200 && delBudgetRes.data.success === true, 'DELETE /api/budgets/:id');
    }

    // 12. Get Goals
    const goalsRes = await request('GET', '/api/goals', null, token);
    assert(goalsRes.status === 200 && Array.isArray(goalsRes.data.data), 'GET /api/goals');

    // 13. Create Goal
    const createGoalRes = await request('POST', '/api/goals', {
      name: 'Sony Headphones',
      targetAmount: 25000,
      currentAmount: 5000,
      deadline: '2026-12-31'
    }, token);
    assert(createGoalRes.status === 201 && createGoalRes.data.data.name === 'Sony Headphones', 'POST /api/goals');
    const newGoalId = createGoalRes.data.data?._id;

    // 14. Add money to Goal
    if (newGoalId) {
      const addMoneyRes = await request('PUT', `/api/goals/${newGoalId}/add-money`, {
        amount: 2000
      }, token);
      assert(addMoneyRes.status === 200 && addMoneyRes.data.data.currentAmount === 7000, 'PUT /api/goals/:id/add-money');

      // 15. Delete Goal
      const delGoalRes = await request('DELETE', `/api/goals/${newGoalId}`, null, token);
      assert(delGoalRes.status === 200 && delGoalRes.data.success === true, 'DELETE /api/goals/:id');
    }

    // 16. Get Recurring
    const recurringRes = await request('GET', '/api/recurring', null, token);
    assert(recurringRes.status === 200 && Array.isArray(recurringRes.data.data), 'GET /api/recurring');

    // 17. Create Recurring
    const createRecurringRes = await request('POST', '/api/recurring', {
      name: 'Gym Membership',
      amount: 2000,
      category: 'Health',
      frequency: 'Monthly',
      nextPaymentDate: '2026-10-01'
    }, token);
    assert(createRecurringRes.status === 201 && createRecurringRes.data.data.name === 'Gym Membership', 'POST /api/recurring');
    const newRecurringId = createRecurringRes.data.data?._id;

    // 18. Update Recurring
    if (newRecurringId) {
      const updateRecurringRes = await request('PUT', `/api/recurring/${newRecurringId}`, {
        amount: 2200
      }, token);
      assert(updateRecurringRes.status === 200 && updateRecurringRes.data.data.amount === 2200, 'PUT /api/recurring/:id');

      // 19. Delete Recurring
      const delRecurringRes = await request('DELETE', `/api/recurring/${newRecurringId}`, null, token);
      assert(delRecurringRes.status === 200 && delRecurringRes.data.success === true, 'DELETE /api/recurring/:id');
    }

    // 20. Analytics Endpoints
    const summaryRes = await request('GET', '/api/analytics/summary', null, token);
    assert(summaryRes.status === 200 && summaryRes.data.data.totalBalance !== undefined, 'GET /api/analytics/summary');

    const catRes = await request('GET', '/api/analytics/categories', null, token);
    assert(catRes.status === 200 && Array.isArray(catRes.data.data), 'GET /api/analytics/categories');

    const monthlyRes = await request('GET', '/api/analytics/monthly', null, token);
    assert(monthlyRes.status === 200 && Array.isArray(monthlyRes.data.data), 'GET /api/analytics/monthly');

    const weeklyRes = await request('GET', '/api/analytics/weekly', null, token);
    assert(weeklyRes.status === 200 && Array.isArray(weeklyRes.data.data), 'GET /api/analytics/weekly');

    const insightsRes = await request('GET', '/api/analytics/insights', null, token);
    assert(insightsRes.status === 200 && Array.isArray(insightsRes.data.data), 'GET /api/analytics/insights');

    // 21. Register New User & User Data Isolation Check
    const uniqueEmail = `user_${Date.now()}@test.com`;
    const regRes = await request('POST', '/api/auth/register', {
      name: 'New Test User',
      email: uniqueEmail,
      password: 'password123'
    });
    assert(regRes.status === 201 && regRes.data.token, 'POST /api/auth/register (new unique user)');
    const newUserToken = regRes.data.token;

    // Verify new user has 0 transactions (data isolation)
    const newUserTx = await request('GET', '/api/transactions', null, newUserToken);
    assert(newUserTx.status === 200 && newUserTx.data.data.length === 0, 'Data Isolation: New user has 0 transactions');

    console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed`);
    if (failed === 0) {
      console.log('🎉 ALL BACKEND API TESTS PASSED SUCCESSFULLY!\n');
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
