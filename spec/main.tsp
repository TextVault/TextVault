import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi";
import "@typespec/versioning";

using TypeSpec.Http;
using TypeSpec.Rest;
using TypeSpec.OpenAPI;

@service({
    title: "TextVault API",
    version: "1.0.0",
    description: "TextVault API",
})
namespace TextVault;

@tag("Paste")
@route("/pastes")
namespace paste {

@TypeSpec.OpenAPI.defaultResponse
model Paste {
    id: string;
    title: string;
    language: string;
    content: string;
    authorID: string | null = null;
    views: numeric = 0;

    createdAt: utcDateTime;
    updatedAt: utcDateTime;
}

@TypeSpec.OpenAPI.defaultResponse
model Pastes is Paste[];

@TypeSpec.OpenAPI.defaultResponse
model PasteCreate {
    title: string;
    language: string;
    content: string;
}

@TypeSpec.OpenAPI.defaultResponse
model PasteUpdate {
    title?: string;
    language?: string;
    content?: string;
}

@get
@useAuth(BearerAuth)
op getUserPastes(@query offset: int32, @query limit: int32): {
    @statusCode statusCode: 200;
    @body body: Pastes;
};

@get
op getPasteByID(@path id: string): {
    @statusCode statusCode: 200;
    @body body: Paste;
};

@post
@useAuth(BearerAuth | NoAuth)
op createPaste(@body paste: PasteCreate): {
    @statusCode statusCode: 201;
    @body body: Paste;
};

@delete
@useAuth(BearerAuth)
op deletePaste(@path id: string): {
    @statusCode statusCode: 204;
};

@put
@useAuth(BearerAuth)
op updatePaste(@path id: string, @body paste: PasteUpdate): {
    @statusCode statusCode: 200;
    @body body: Paste;
};
}

@tag("Account")
@route("/account")
namespace account {
@TypeSpec.OpenAPI.defaultResponse
model User {
    id: string;
    name: string;
    email: string;
}
@get
op getProfile(): {
    @statusCode statusCode: 200;
    @body body: User;
};
}
