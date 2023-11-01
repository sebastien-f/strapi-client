process.env['NODE_DEV'] = 'TEST';
import { apiBaseUrl } from "../../src/modifiers/apiBaseUrl";
import { apiEndpoint } from "../../src/modifiers/apiEndpoint";
import { apiPrefix } from "../../src/modifiers/apiPrefix";
import { pagination } from "../../src/modifiers/pagination";
import { withJWT } from "../../src/modifiers/withJWT";
import { ListOperation }  from "../../src/operations/list";


describe('Operations', () => {
    describe("ListOperation", () => {
        test('newing ListOperation with a null requestModifier should NOT throw', () => {
            expect(() => {
                new ListOperation(null as any);
              }).not.toThrow();
        });
        test('ListOperation.prepare to generate a proper url', () => {
            const l = new ListOperation([
                apiEndpoint("some/content/somewhere")
            ]);
            const p = l.prepare([
                apiBaseUrl("http://foo.bar.com:2531/any/thing/"),
                apiPrefix("/api/")
            ])
            expect(p.url).toBe("http://foo.bar.com:2531/any/thing/api/some/content/somewhere");
        });
        test('ListOperation.real', () => {
            const l = new ListOperation([
                apiBaseUrl("http://192.168.1.15:8105"),
                apiPrefix("api"),
                apiEndpoint("establishments"),
                pagination({ type:"page", pageSize:5 }),
                withJWT(""),
            ]);
            const p = l.prepare();

            //console.log("p", p);

            expect(true).toBe(true);

        });
    })
});