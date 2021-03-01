<!-- Generator: Widdershins v4.0.1 -->

<h1 id="flow-builder-routes">Flow Builder Routes v1.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

This document describes the specification for any implementation of the server required for integration of the flow builder with a backend.

Base URLs:

* <a href="/">/</a>

<h1 id="flow-builder-routes-flows">Flows</h1>

Operations about flows and flow blocks

<a href="https://floip.gitbook.io/flow-specification/">Find out more about flows</a>

## get__flows_{id}

> Code samples

```javascript

const headers = {
  'Accept':'application/json'
};

fetch('/flows/{id}',
{
  method: 'GET',

  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`GET /flows/{id}`

*Finds Flow in Container by ID*

<h3 id="get__flows_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID of flow to return.|

> Example responses

> 200 Response

```json
{
  "specification_version": "string",
  "uuid": "string",
  "name": "string",
  "description": "string",
  "platform_metadata": {},
  "flows": [
    {}
  ],
  "resources": {}
}
```

<h3 id="get__flows_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Returns the flow in a container on success. See https://floip.gitbook.io/flow-specification/flows#containers for full spec. The 'flows' attribute of the returned container will contain the flow itself and any nested flows. 'resources' will contain any nested resources|[FlowContainer](#schemaflowcontainer)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Flow not found|None|

<h3 id="get__flows_{id}-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## post__flows_{id}

> Code samples

```javascript
const inputBody = '{
  "specification_version": "string",
  "uuid": "string",
  "name": "string",
  "description": "string",
  "platform_metadata": {},
  "flows": [
    {}
  ],
  "resources": {}
}';
const headers = {
  'Content-Type':'*/*',
  'Accept':'application/json'
};

fetch('/flows/{id}',
{
  method: 'POST',
  body: inputBody,
  headers: headers
})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /flows/{id}`

*Create or update a Flow and associated Resources. UUIDs are generated client side and for simplicity we allow creation and updates at a single endpoint. This follows the model where the builder frontend can work as a standalone app without a backend when necessary and not contain logic related to whether a Flow is persisted or not.*

> Body parameter

<h3 id="post__flows_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|Creates or updates a flow and it's associated resources by ID|
|body|body|[FlowContainer](#schemaflowcontainer)|true|none|

> Example responses

> 200 Response

```json
{
  "specification_version": "string",
  "uuid": "string",
  "name": "string",
  "description": "string",
  "platform_metadata": {},
  "flows": [
    {}
  ],
  "resources": {}
}
```

<h3 id="post__flows_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Echos back the sent flow in a container on success. See https://floip.gitbook.io/flow-specification/flows#containers for full spec. The 'flows' attribute of the returned container will contain the flow itself and any nested flows. 'resources' will contain any nested resources|[FlowContainer](#schemaflowcontainer)|
|500|[Internal Server Error](https://tools.ietf.org/html/rfc7231#section-6.6.1)|Error in flow creation including validation errors (the builder should prevent these client side before we get to that point though)|None|

<h3 id="post__flows_{id}-responseschema">Response Schema</h3>

<aside class="success">
This operation does not require authentication
</aside>

## post__flows_import

> Code samples

```javascript

fetch('/flows/import',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /flows/import`

WIP

<h3 id="post__flows_import-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|WIP|None|

<aside class="success">
This operation does not require authentication
</aside>

## post__blocks_{id}

> Code samples

```javascript

fetch('/blocks/{id}',
{
  method: 'POST'

})
.then(function(res) {
    return res.json();
}).then(function(body) {
    console.log(body);
});

```

`POST /blocks/{id}`

WIP

<h3 id="post__blocks_{id}-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|ID of the block.|

<h3 id="post__blocks_{id}-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|WIP|None|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

<h2 id="tocS_FlowContainer">FlowContainer</h2>
<!-- backwards compatibility -->
<a id="schemaflowcontainer"></a>
<a id="schema_FlowContainer"></a>
<a id="tocSflowcontainer"></a>
<a id="tocsflowcontainer"></a>

```json
{
  "specification_version": "string",
  "uuid": "string",
  "name": "string",
  "description": "string",
  "platform_metadata": {},
  "flows": [
    {}
  ],
  "resources": {}
}

```

### Properties

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|specification_version|string|false|none|none|
|uuid|string|false|none|none|
|name|string|false|none|none|
|description|string|false|none|none|
|platform_metadata|object|false|none|none|
|flows|[object]|false|none|none|
|resources|object|false|none|none|
