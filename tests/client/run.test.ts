process.env['NODE_DEV'] = 'TEST';
import { run } from "../../src/client/run";
import { apiBaseUrl } from "../../src/modifiers/apiBaseUrl";
import { apiEndpoint } from "../../src/modifiers/apiEndpoint";
import { apiPrefix } from "../../src/modifiers/apiPrefix";
import { pagination } from "../../src/modifiers/pagination";
import { withJWT } from "../../src/modifiers/withJWT";
import { method } from "../../src/modifiers/method";
import { RawOperation }  from "../../src/operations/raw";
import { StrapiClient } from "../../src/client/StrapiClient";


describe('Client', () => {
    describe("localAuth", () => {
        test("should not send a jwt token", async () => {
            const client = new StrapiClient({
                baseUrl:"https://strapi.dev.famiwine.fr",
                showDebug:true,
                showRuntime:true,
                timeout:2000,
            });

            client.setJwtTokenIfNone("eyJhbGciOiJ...");

            await client.localAuth("foo", "bar");
        });
    });
    describe("run", () => {
        test('timeout options should properly timeout', async () => {
            const l = new RawOperation([
                apiBaseUrl("http://192.168.1.15:8105"),
                apiPrefix("api"),
                apiEndpoint("establishments"),
                pagination({ type:"page", pageSize:5 }),
                withJWT("eyJhbGciOiJ..."),
                method("POST"),
            ]);

            const failingTest = async () => {
                await run(l, [], { timeout: 500 });
            }

            await expect(failingTest()).rejects.toThrow();

        });
    })
});