# Payment Testing Guide

## 🧪 Paystack Test Mode Active

Your website now has Paystack test keys integrated and is ready for payment testing!

---

## ✅ What's Integrated

**Test Public Key**: `pk_test_fddef2e69c5847592ad7abafc0c6de15508e09e8`

**Status**: ✅ Active and ready for testing

---

## 🧪 How to Test Payments

### Step 1: Navigate to Car Details

1. Go to your website
2. Navigate to **Cars** page
3. Click on any car to view details
4. Click the **"Buy Now"** button

### Step 2: Enter Customer Details

You'll be prompted to enter:
- **Email**: Use any email (e.g., test@example.com)
- **Name**: Enter any name (e.g., Test User)
- **Phone**: Enter phone number (e.g., 08012345678)

### Step 3: Use Test Cards

The Paystack payment modal will open. Use these test cards:

#### ✅ Successful Payment
- **Card Number**: `4084084084084081`
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVV**: `408`
- **PIN**: `0000`
- **OTP**: `123456`

**Result**: Payment succeeds ✅

#### ❌ Insufficient Funds
- **Card Number**: `5060666666666666666`
- **Expiry Date**: Any future date
- **CVV**: `123`

**Result**: Payment fails with "Insufficient Funds" error

#### ❌ Invalid Transaction
- **Card Number**: `5080080080080080`
- **Expiry Date**: Any future date
- **CVV**: `123`

**Result**: Payment fails with error

---

## 🔍 What to Verify

### 1. Payment Modal Opens ✅
- After clicking "Buy Now" and entering details
- Paystack modal should appear
- Shows car details and amount

### 2. Test Card Works ✅
- Enter test card: 4084084084084081
- CVV: 408, PIN: 0000
- Payment processes successfully
- Success message displays

### 3. Transaction Recorded ✅
- Check Supabase database → `transactions` table
- New transaction should be recorded with:
  - Customer name, email, phone
  - Car ID
  - Payment amount
  - Payment reference
  - Status: "Success"

### 4. WhatsApp Redirect ✅
- After successful payment
- WhatsApp should open with payment confirmation message
- Message includes car details and payment reference

### 5. Check Paystack Dashboard ✅
- Go to: https://dashboard.paystack.com
- Navigate to **Transactions**
- Your test transaction should appear
- Shows as "Successful" in test mode

---

## 📊 Test Scenarios Checklist

Run through these scenarios:

- [ ] **Successful Payment**
  - Use card: 4084084084084081
  - Complete full payment flow
  - Verify transaction in database
  - Check WhatsApp notification

- [ ] **Failed Payment (Insufficient Funds)**
  - Use card: 5060666666666666666
  - Verify error message shows
  - No transaction recorded

- [ ] **Payment Cancellation**
  - Click "Buy Now"
  - Open payment modal
  - Close modal without paying
  - Verify "Payment cancelled" message

- [ ] **Different Browsers**
  - Test on Chrome ✅
  - Test on Firefox ✅
  - Test on Safari ✅
  - Test on Mobile ✅

- [ ] **Different Cars**
  - Test payment on multiple cars
  - Verify correct amounts
  - Check car details in transaction

---

## 🔐 Test vs Live Keys

### Current: Test Mode 🧪

**Test Public Key**: `pk_test_fddef2e69c5847592ad7abafc0c6de15508e09e8`

**Characteristics**:
- ✅ Uses test cards only
- ✅ No real money charged
- ✅ Transactions appear in test mode dashboard
- ✅ Safe for unlimited testing

### Going Live: Production Mode 🚀

**When Ready for Real Payments**:

1. **Get Live Key**
   - Go to: https://dashboard.paystack.com/settings/developer
   - Copy your **Live Public Key** (starts with `pk_live_`)

2. **Update Config**
   - Open: `scripts/config.js`
   - Replace test key with live key:
     ```javascript
     PAYSTACK_PUBLIC_KEY: 'pk_live_your_actual_live_key_here'
     ```

3. **Rebuild**
   ```bash
   npm run build
   ```

4. **Deploy**
   - Deploy updated code to production
   - Real payments now active! 💰

---

## 🆘 Troubleshooting

### Problem: Payment Modal Doesn't Open

**Possible Causes**:
- Paystack script not loaded
- JavaScript error

**Solutions**:
1. Open browser console (F12)
2. Check for errors
3. Verify `https://js.paystack.co/v1/inline.js` is loaded
4. Check `CONFIG.PAYSTACK_PUBLIC_KEY` is set

### Problem: "Invalid Key" Error

**Possible Causes**:
- Wrong key format
- Key not set in config.js

**Solutions**:
1. Open `scripts/config.js`
2. Verify key starts with `pk_test_`
3. Ensure no extra spaces or quotes
4. Reload page

### Problem: Payment Succeeds But Not Recorded

**Possible Causes**:
- Database connection issue
- Transaction service error

**Solutions**:
1. Check browser console for errors
2. Verify Supabase connection
3. Check `transactions` table in Supabase
4. Ensure RLS policies allow inserts

### Problem: Test Card Not Working

**Solution**:
- Use exactly: **4084084084084081**
- CVV: **408**
- PIN: **0000**
- OTP: **123456**
- Ensure date is in future (e.g., 12/25)

---

## 📝 Test Payment Example

### Complete Flow Example

1. **User Journey**:
   ```
   Homepage → Cars Page → Car Details (Toyota Camry 2024)
   → Click "Buy Now"
   → Enter: test@example.com, Test User, 08012345678
   → Payment modal opens
   → Enter card: 4084084084084081
   → CVV: 408, PIN: 0000, OTP: 123456
   → Payment Success! ✅
   → WhatsApp opens with confirmation
   ```

2. **Database Record**:
   ```
   Transaction created in Supabase:
   - car_id: [Car UUID]
   - customer_name: "Test User"
   - customer_email: "test@example.com"
   - customer_phone: "08012345678"
   - amount: 18000000
   - payment_reference: "MA-123456789"
   - payment_status: "Success"
   ```

3. **Paystack Dashboard**:
   ```
   New transaction appears:
   - Amount: ₦18,000,000
   - Customer: test@example.com
   - Status: Successful
   - Reference: MA-123456789
   ```

---

## 🎯 Testing Best Practices

### DO ✅

- **Test all payment scenarios** (success, fail, cancel)
- **Verify database records** after each test
- **Check Paystack dashboard** for transactions
- **Test on multiple devices** and browsers
- **Use actual test cards** provided by Paystack
- **Record any errors** you encounter
- **Test WhatsApp integration** works

### DON'T ❌

- **Don't use real cards** in test mode (won't work)
- **Don't expect real money** to be charged (test mode)
- **Don't skip testing** before going live
- **Don't forget to switch** to live keys for production
- **Don't share secret keys** publicly (only public keys safe)

---

## 📊 Test Results Template

Use this to track your testing:

```
## Payment Testing Results

Date: [DATE]
Tester: [NAME]

### Test 1: Successful Payment ✅
- Card: 4084084084084081
- Amount: ₦18,000,000 (Toyota Camry)
- Result: ✅ Success
- Transaction ID: MA-123456789
- Database: ✅ Recorded
- WhatsApp: ✅ Opened

### Test 2: Failed Payment (Insufficient Funds) ✅
- Card: 5060666666666666666
- Result: ✅ Error shown correctly
- Database: ✅ No record (as expected)

### Test 3: Payment Cancellation ✅
- Result: ✅ "Payment cancelled" message
- Database: ✅ No record (as expected)

### Test 4: Multiple Browsers ✅
- Chrome: ✅ Works
- Firefox: ✅ Works
- Safari: ✅ Works
- Mobile: ✅ Works

### Issues Found:
- [List any issues]

### Overall: ✅ PASS / ❌ FAIL
```

---

## 🚀 Ready to Go Live Checklist

Before switching to live keys:

- [ ] All test scenarios pass ✅
- [ ] Payments work on all browsers
- [ ] Database recording works correctly
- [ ] WhatsApp integration works
- [ ] Error handling works properly
- [ ] Mobile experience tested
- [ ] Team trained on monitoring transactions
- [ ] Backup plan in place
- [ ] Live keys obtained from Paystack
- [ ] Ready to process real payments

---

## 📞 Support

### Paystack Support
- **Dashboard**: https://dashboard.paystack.com
- **Documentation**: https://paystack.com/docs
- **Support**: support@paystack.com

### Website Issues
- Check browser console for errors
- Verify all keys in `scripts/config.js`
- Ensure Supabase connection active
- Check RLS policies in database

---

## 🎉 Summary

**Current Status**: 🧪 **Test Mode Active**

**You Can Now**:
- ✅ Test payments with test cards
- ✅ See transactions in Paystack dashboard (test mode)
- ✅ Verify database recording works
- ✅ Test full payment flow end-to-end
- ✅ Prepare for going live

**When Ready**:
- 🚀 Switch to live keys
- 🚀 Process real payments
- 🚀 Start selling cars online!

---

**Happy Testing! Test thoroughly before going live.** 🧪✅
