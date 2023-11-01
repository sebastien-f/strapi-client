process.env['NODE_DEV'] = 'TEST';
import { BaseRequestModifier } from "../../src/modifiers/BaseRequestModifier";
import { apiBaseUrl } from "../../src/modifiers/apiBaseUrl";
import { apiEndpoint } from "../../src/modifiers/apiEndpoint";
import { apiPrefix } from "../../src/modifiers/apiPrefix";
import { bodyValue } from "../../src/modifiers/bodyValue";
import { entryId } from "../../src/modifiers/entryId";
import { BaseOperation, BaseOperationData }  from "../../src/operations/BaseOperation";

class TestOperation extends BaseOperation<any>
{
    public constructor(modifiers: Array<BaseRequestModifier>) {
        super("TestOperation", modifiers)
    }

    public prepare(extraModifiers: Array<BaseRequestModifier> = []): BaseOperationData {
        const modifiers = [
            ...extraModifiers,
            ...this.requestModifiers
        ]

        const method = this.getMethod(modifiers)?.method || "GET";

        return {
            body:this.getBody(modifiers),
            headers:this.getHeaders(modifiers),
            url:this.getUrl(modifiers),
            method,
        }
    }
}

describe('Operations', () => {
    describe("BaseOperation.prepare", () => {
        test('BaseOperation.prepare to generate a proper url', () => {
            const l = new TestOperation([
                apiEndpoint("some/content/somewhere")
            ]);
            const p = l.prepare([
                apiBaseUrl("http://foo.bar.com:2531/any/thing/"),
                apiPrefix("/api/")
            ])
            expect(p.url).toBe("http://foo.bar.com:2531/any/thing/api/some/content/somewhere");
        });
        test('BaseOperation', () => {
            const l = new TestOperation([
                apiBaseUrl("http://foo.bar.com:2531/any/thing/"),
                apiPrefix("/my-api/"),
                apiEndpoint("/some-endpoint/:entryId"),
                entryId(5),
            ]);

            const p = l.prepare();
            expect(p.url).toBe("http://foo.bar.com:2531/any/thing/my-api/some-endpoint/5");
        });
    })
});