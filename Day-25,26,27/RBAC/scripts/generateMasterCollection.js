const fs = require('fs');
const path = require('path');

const adminCol = JSON.parse(fs.readFileSync('postman/collections/v1-admin.postman_collection.json', 'utf8'));
const userCol = JSON.parse(fs.readFileSync('postman/collections/v1-user.postman_collection.json', 'utf8'));
const subadminCol = JSON.parse(fs.readFileSync('postman/collections/v1-subadmin.postman_collection.json', 'utf8'));

// Deep clone helper
const clone = (obj) => JSON.parse(JSON.stringify(obj));

const masterCollection = {
  info: {
    name: "v1-master-enterprise-backend",
    description: "Comprehensive Master Collection covering all 175 endpoints with positive, negative, validation, and RBAC test cases",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: []
};

// 1. Health & Meta
masterCollection.item.push(clone(adminCol.item.find(i => i.name === '00 Health')));

// 2. Admin Authentication & Profile Lifecycle
masterCollection.item.push(clone(adminCol.item.find(i => i.name === '01 Auth')));

// 3. User Management (Admin)
masterCollection.item.push(clone(adminCol.item.find(i => i.name === '03 User Management')));

// 4. Subadmin Management & Fine-Grained RBAC
const subadminFolder = clone(adminCol.item.find(i => i.name === '02 Subadmin Management'));
masterCollection.item.push(subadminFolder);

// 5. Inventory, Categories, Products & Stock
masterCollection.item.push(clone(adminCol.item.find(i => i.name === '04 Inventory')));

// 6. Coupons & Orders (Admin)
masterCollection.item.push(clone(adminCol.item.find(i => i.name === '05 Coupons & Orders')));

// 7. Wallets & Transactions & Invoices & Reports (Admin)
masterCollection.item.push(clone(adminCol.item.find(i => i.name === '06 Wallets & Transactions')));

// 8. Notifications, Help Desk, Settings, FAQ, Audit Logs (Admin)
masterCollection.item.push(clone(adminCol.item.find(i => i.name === '07 Notifications & Help & Settings & FAQ')));

// 9. Customer User Flows (Registration, Profile, Catalog, Wallet, Cart, Order, Tickets)
userCol.item.forEach(folder => {
  if (folder.name !== '00 Bootstrap Fixtures') {
    masterCollection.item.push(clone(folder));
  }
});

// 10. Subadmin Dynamic RBAC & Negative Tests
subadminCol.item.forEach(folder => {
  masterCollection.item.push(clone(folder));
});

// Now let's add negative tests and edge cases in a dedicated "Negative & Security Tests" folder
const negativeTestsFolder = {
  name: "11 Security & Negative Test Cases",
  item: [
    {
      name: "[GET] Unauthorized Access Without Token (Expect 401)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status is 401', () => pm.response.to.have.status(401));",
              "const json = pm.response.json();",
              "pm.test('Success is false', () => pm.expect(json.success).to.be.false);",
              "pm.test('Error code is UNAUTHORIZED', () => pm.expect(json.code).to.eql('UNAUTHORIZED'));"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "GET",
        header: [
          { key: "Accept", value: "application/json", type: "text" }
        ],
        url: {
          raw: "{{baseUrl}}/admin/orders",
          host: ["{{baseUrl}}"],
          path: ["admin", "orders"]
        }
      },
      response: []
    },
    {
      name: "[GET] Cross-Actor Token Rejection (User token on Admin route -> Expect 403)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status is 403', () => pm.response.to.have.status(403));",
              "const json = pm.response.json();",
              "pm.test('Success is false', () => pm.expect(json.success).to.be.false);",
              "pm.test('Error code is FORBIDDEN', () => pm.expect(json.code).to.eql('FORBIDDEN'));"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "GET",
        header: [
          { key: "Accept", value: "application/json", type: "text" },
          { key: "Authorization", value: "Bearer {{userAccessToken}}", type: "text" }
        ],
        url: {
          raw: "{{baseUrl}}/admin/subadmin-management/subadmins",
          host: ["{{baseUrl}}"],
          path: ["admin", "subadmin-management", "subadmins"]
        }
      },
      response: []
    },
    {
      name: "[POST] Invalid Schema Validation (Expect 422 with Zod field errors)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status is 422', () => pm.response.to.have.status(422));",
              "const json = pm.response.json();",
              "pm.test('Validation error code returned', () => pm.expect(json.code).to.eql('VALIDATION_ERROR'));",
              "pm.test('Errors array populated', () => pm.expect(json.errors.length).to.be.greaterThan(0));"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "POST",
        header: [
          { key: "Accept", value: "application/json", type: "text" },
          { key: "Content-Type", value: "application/json", type: "text" },
          { key: "Authorization", value: "Bearer {{adminAccessToken}}", type: "text" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({ name: "" }),
          options: { raw: { language: "json" } }
        },
        url: {
          raw: "{{baseUrl}}/admin/inventory/categories",
          host: ["{{baseUrl}}"],
          path: ["admin", "inventory", "categories"]
        }
      },
      response: []
    },
    {
      name: "[GET] Non-Existent Resource (Expect 404)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status is 404', () => pm.response.to.have.status(404));",
              "const json = pm.response.json();",
              "pm.test('Error code is NOT_FOUND', () => pm.expect(json.code).to.eql('NOT_FOUND'));"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "GET",
        header: [
          { key: "Accept", value: "application/json", type: "text" },
          { key: "Authorization", value: "Bearer {{adminAccessToken}}", type: "text" }
        ],
        url: {
          raw: "{{baseUrl}}/admin/inventory/products/00000000-0000-0000-0000-000000000000",
          host: ["{{baseUrl}}"],
          path: ["admin", "inventory", "products", "00000000-0000-0000-0000-000000000000"]
        }
      },
      response: []
    },
    {
      name: "[POST] User Registration Duplicate Email (Negative - Expect 409 Conflict)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "pm.test('Status is 409', () => pm.response.to.have.status(409));",
              "const json = pm.response.json();",
              "pm.test('Conflict code or message returned', () => pm.expect(json.success).to.be.false);"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "POST",
        header: [
          { key: "Accept", value: "application/json", type: "text" },
          { key: "Content-Type", value: "application/json", type: "text" }
        ],
        body: {
          mode: "raw",
          raw: JSON.stringify({
            fullName: "Duplicate User",
            email: "testuser_e2e@example.com",
            phone: "+1234567890",
            password: "UserPassword123!"
          }),
          options: { raw: { language: "json" } }
        },
        url: {
          raw: "{{baseUrl}}/user/auth/register",
          host: ["{{baseUrl}}"],
          path: ["user", "auth", "register"]
        }
      },
      response: []
    }
  ]
};

masterCollection.item.push(negativeTestsFolder);

const targetFile = path.resolve('postman/collections/v1-master-all-endpoints.postman_collection.json');
fs.writeFileSync(targetFile, JSON.stringify(masterCollection, null, 2), 'utf8');

console.log('Master collection successfully generated at:', targetFile);
let count = 0;
function countItems(items) {
  items.forEach(it => {
    if (it.request) count++;
    if (it.item) countItems(it.item);
  });
}
countItems(masterCollection.item);
console.log('Total requests in Master Collection:', count);
