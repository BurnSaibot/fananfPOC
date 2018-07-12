var mongoose = require('mongoose');
describe("MongoDB", function() {
    it("is there a server running", function(next) {
        mongoose.connect('mongodb://localhost/fananfdb', function(err){
            expect(err).toBe(null);
            next();
        });
    });
});