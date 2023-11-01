process.env['NODE_DEV'] = 'TEST';
import { PopulateModifier } from "../../src/modifiers/populate"

describe('Modifiers', () => {
    describe("populate", () => {
        test('newing with a null fields should NOT throw', () => {
            expect(() => {
                new PopulateModifier(null as any);
            }).not.toThrow();
        });
        test('enrichQueryParameters with a null field should return an empty array for populate', () => {
            let m = new PopulateModifier(null as any);
            let r = m.enrichQueryParameters({});

            expect(r.populate).toEqual([]);
        });
        test('enrichQueryParameters with a null field should return an empty array for populate', () => {
            let m = new PopulateModifier([]);
            let r = m.enrichQueryParameters({});

            expect(r.populate).toEqual([]);
        });
        test('enrichQueryParameters with a single string should return populate with that value', () => {
            let m = new PopulateModifier(["foo"]);
            let r = m.enrichQueryParameters({});
            expect(r.populate).toEqual("foo");
        });
        test('enrichQueryParameters with multiple strings should return populate with an array of those values', () => {
            let m = new PopulateModifier(["foo", "bar"]);
            let r = m.enrichQueryParameters({});
            expect(r.populate).toEqual(["foo", "bar"]);
        });
        test('multiple string poulate modifier should produce the expected results', () => {
            let m1 = new PopulateModifier(["foo"]);
            let r1 = m1.enrichQueryParameters({});
            let m2 = new PopulateModifier(["bar"]);
            let r2 = m2.enrichQueryParameters(r1);
            expect(r2.populate).toEqual(["foo", "bar"]);
        });
        test('enrichQueryParameters with multiple strings and subfields', () => {
            let m = new PopulateModifier(["foo", "bar"]);
            let r = m.enrichQueryParameters({});
            expect(r.populate).toEqual(["foo", "bar"]);
        });
        test('enrichQueryParameters with count field should generate an object', () => {
            let m = new PopulateModifier(["foo#count"]);
            let r = m.enrichQueryParameters({});
            expect(r.populate).toMatchObject({ foo: { count: true } });
        });
        test('enrichQueryParameters with count field should generate an object and support non count field', () => {
            let m = new PopulateModifier(["foo#count", "bar"]);
            let r = m.enrichQueryParameters({});
            expect(r.populate).toMatchObject({ foo: { count: true }, bar: true });
        });

        test('enrichQueryParameters with simple relationship should produce the proper result', () => {
            let m = new PopulateModifier(["relation1", "relation1.subrelation", "relation1.subrelation.another"]);
            let r = m.enrichQueryParameters({});
            expect(r.populate).toEqual(["relation1", "relation1.subrelation", "relation1.subrelation.another"]);
        });
        test('enrichQueryParameters with a count and relationsip should poroduce an object', () => {
            let m = new PopulateModifier([
                "kitchen", "lastReview.populate.expert", "likedByUser#count",
                "location.populate.country", "types", "menu",
                "service", "setting"
            ]);
            let r = m.enrichQueryParameters({ populate: "foo.bar" });
            expect(r.populate).toMatchObject({
                foo: {
                    bar: true,
                },
                "kitchen": true,
                "lastReview": {
                    populate: {
                        expert: true,
                    }
                },
                "likedByUser": {
                    "count": true
                },
                "location": {
                    populate: {
                        country: true
                    }
                },
                "menu": true,
                "service": true,
                "setting": true,
                "types": true
            });
        });
    })
});