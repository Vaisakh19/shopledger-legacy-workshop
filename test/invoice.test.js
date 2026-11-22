'use strict';

var assert = require('node:assert/strict');
var test = require('node:test');

var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

test('invoice figures match the GST and total billed at checkout', function () {
  var items = [
    { id: 1, name: 'Rice', sku: 'RICE-1', hsn: '1006', price: 5000, qty: 1 }
  ];
  var billed = pricing.computeTotals(items, 'SAVE10');
  var printed = invoice.computeInvoiceFigures({
    items: items,
    coupon: 'SAVE10',
    tax: billed.tax,
    total: billed.total
  });

  assert.equal(printed.rows[0].gstPercent, billed.lines[0].gstPercent);
  assert.equal(printed.tax, billed.tax);
  assert.equal(printed.discount, billed.discount);
  assert.equal(printed.total, billed.total);
});

test('invoice uses the HSN GST rate billed at checkout', function () {
  var items = [
    { id: 1, name: 'Rice', sku: 'RICE-1', hsn: '1006', price: 100, qty: 1 }
  ];
  var billed = pricing.computeTotals(items, '');
  var printed = invoice.computeInvoiceFigures({ items: items, coupon: '' });

  assert.equal(printed.rows[0].gstPercent, billed.lines[0].gstPercent);
  assert.equal(printed.tax, billed.tax);
  assert.equal(printed.total, billed.total);
});

test('invoice uses the checkout coupon cap and post-discount taxable amount', function () {
  var items = [
    { id: 1, name: 'Rice', sku: 'RICE-1', hsn: '1006', price: 5000, qty: 1 }
  ];
  var billed = pricing.computeTotals(items, 'SAVE10');
  var printed = invoice.computeInvoiceFigures({ items: items, coupon: 'SAVE10' });

  assert.equal(printed.discount, billed.discount);
  assert.equal(printed.tax, billed.tax);
  assert.equal(printed.total, billed.total);
});
