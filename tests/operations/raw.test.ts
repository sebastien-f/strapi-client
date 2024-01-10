process.env['NODE_DEV'] = 'TEST';
import { apiBaseUrl } from "../../src/modifiers/apiBaseUrl";
import { apiEndpoint } from "../../src/modifiers/apiEndpoint";
import { apiPrefix } from "../../src/modifiers/apiPrefix";
import { pagination } from "../../src/modifiers/pagination";
import { entryId } from "../../src/modifiers/entryId";
import { withJWT } from "../../src/modifiers/withJWT";
import { fields } from "../../src/modifiers/fields";
import { rawModifier } from "../../src/modifiers/rawModifier";
import { RawOperation }  from "../../src/operations/raw";


describe('Operations', () => {
    describe("Raw", () => {
        test('RawOperation.prepare to generate a proper url', () => {
            const l = new RawOperation([
                apiBaseUrl("http://192.168.1.15:8105"),
                apiPrefix("api"),
                apiEndpoint("establishments/:entryId"),
                entryId(5),
                fields("id"),
                rawModifier({
                    method:"GET",
                    querystring:{
                        populate: {
                            "winemakersServed": {
                              fields:["name", "id"],
                              populate: [ "location.country" ]
                            }
                          }
                    },
                })
            ]);

            const p = l.prepare();
        });

    })
});