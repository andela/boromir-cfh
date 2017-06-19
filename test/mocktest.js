describe("true", function() {
  it("Should be true", function () {
    expect(true).toBeTruthy();
  });
});


describe('sum', function() {
    // body...
  it('summing two numbers', function() {
    expect(2 + 2).toEqual(4);
  });
});