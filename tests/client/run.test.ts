process.env['NODE_DEV'] = 'TEST';
import { run } from "../../src/client/run";
import { apiBaseUrl } from "../../src/modifiers/apiBaseUrl";
import { apiEndpoint } from "../../src/modifiers/apiEndpoint";
import { apiPrefix } from "../../src/modifiers/apiPrefix";
import { pagination } from "../../src/modifiers/pagination";
import { withJWT } from "../../src/modifiers/withJWT";
import { method } from "../../src/modifiers/method";
import { RawOperation }  from "../../src/operations/raw";



describe('Client', () => {
    describe("run", () => {
        test('run.real', async () => {
            const l = new RawOperation([
                apiBaseUrl("http://192.168.1.15:8105"),
                apiPrefix("api"),
                apiEndpoint("establishments"),
                pagination({ type:"page", pageSize:5 }),
                withJWT(""),
                method("POST"),
            ]);

            const p = l.prepare();

            expect(p.method).toBe("POST");

        });
    })
});