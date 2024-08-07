import { OKind, objVisitAsync, BREAK } from '../src/';

function sleep(ms = 1) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test("object visit - basic iteration test", async() => {
  let results: any[] = [];
  const newObject = await objVisitAsync({
    name: "hello",
  }, {
    [OKind.OBJECT]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "enter-object", key, node, parent, path, ancestors});
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "leave-object", key, node, parent, path, ancestors});
        return node;
      },
    },
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "enter-field", key, node, parent, path, ancestors});
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "leave-field", key, node, parent, path, ancestors});
        return node;
      },
    },
  });
  
  expect(newObject).toMatchObject({
    name: "hello",
  });
  expect(results).toMatchObject([
    {
      "key": undefined,
      "parent": undefined,
      "action": "enter-object",
      "node": { "name": "hello" },
      "path": [],
      "ancestors": []
    },
    {
      "action": "enter-field",
      "key": "name",
      "node": "hello",
      "parent": { "name": "hello" },
      "path": [],
      "ancestors": []
    },
    {
      "action": "leave-field",
      "key": "name",
      "node": "hello",
      "parent": { "name": "hello" },
      "path": [],
      "ancestors": []
    },
    {
      "key": undefined,
      "parent": undefined,
      "action": "leave-object",
      "node": { "name": "hello" },
      "path": [],
      "ancestors": []
    }
  ]);
});


test("object visit - complex iteration test", async() => {
  let results: any[] = [];
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: true,
    hands: [
      {
        name: "lefty",
      },
      {
        name: "righty",
        optional: true,
      },
      {
        optional: true,
      },
    ],
  }, {
    [OKind.ARRAY]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "enter-array", key, node, parent, path: [...path], ancestors: [...ancestors]});
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "leave-array", key, node, parent, path: [...path], ancestors: [...ancestors]});
        return node;
      },
    },
    [OKind.OBJECT]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "enter-object", key, node, parent, path: [...path], ancestors: [...ancestors]});
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "leave-object", key, node, parent, path: [...path], ancestors: [...ancestors]});
        return node;
      },
    },
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "enter-field", key, node, parent, path: [...path], ancestors: [...ancestors]});
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        results.push({action: "leave-field", key, node, parent, path: [...path], ancestors: [...ancestors]});
        return node;
      },
    },
  });

  expect(newObject).toMatchObject({
    name: "Wilson",
    optional: true,
    hands: [
      {
        name: "lefty",
      },
      {
        name: "righty",
        optional: true,
      },
      {
        optional: true,
      },
    ],
  });
  expect(results).toMatchObject([
    {
      "action": "enter-object",
      "node": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": [],
      "ancestors": []
    },
    {
      "action": "enter-field",
      "key": "name",
      "node": "Wilson",
      "parent": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": ["name"],
      "ancestors": []
    },
    {
      "action": "leave-field",
      "key": "name",
      "node": "Wilson",
      "parent": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": ["name"],
      "ancestors": []
    },
    {
      "action": "enter-field",
      "key": "optional",
      "node": true,
      "parent": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": ["optional"],
      "ancestors": []
    },
    {
      "action": "leave-field",
      "key": "optional",
      "node": true,
      "parent": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": ["optional"],
      "ancestors": []
    },
    {
      "action": "enter-array",
      "key": "hands",
      "node": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "parent": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": ["hands"],
      "ancestors": []
    },
    {
      "action": "enter-object",
      "key": 0,
      "node": { "name": "lefty" },
      "parent": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "path": ["hands", 0],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        }
      ]
    },
    {
      "action": "enter-field",
      "key": "name",
      "node": "lefty",
      "parent": { "name": "lefty" },
      "path": ["hands", 0, "name"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "leave-field",
      "key": "name",
      "node": "lefty",
      "parent": { "name": "lefty" },
      "path": ["hands", 0, "name"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "leave-object",
      "key": 0,
      "node": { "name": "lefty" },
      "parent": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "path": ["hands", 0],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        }
      ]
    },
    {
      "action": "enter-object",
      "key": 1,
      "node": { "name": "righty", "optional": true },
      "parent": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "path": ["hands", 1],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        }
      ]
    },
    {
      "action": "enter-field",
      "key": "name",
      "node": "righty",
      "parent": { "name": "righty", "optional": true },
      "path": ["hands", 1, "name"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "leave-field",
      "key": "name",
      "node": "righty",
      "parent": { "name": "righty", "optional": true },
      "path": ["hands", 1, "name"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "enter-field",
      "key": "optional",
      "node": true,
      "parent": { "name": "righty", "optional": true },
      "path": ["hands", 1, "optional"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "leave-field",
      "key": "optional",
      "node": true,
      "parent": { "name": "righty", "optional": true },
      "path": ["hands", 1, "optional"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "leave-object",
      "key": 1,
      "node": { "name": "righty", "optional": true },
      "parent": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "path": ["hands", 1],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        }
      ]
    },
    {
      "action": "enter-object",
      "key": 2,
      "node": { "optional": true },
      "parent": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "path": ["hands", 2],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        }
      ]
    },
    {
      "action": "enter-field",
      "key": "optional",
      "node": true,
      "parent": { "optional": true },
      "path": ["hands", 2, "optional"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "leave-field",
      "key": "optional",
      "node": true,
      "parent": { "optional": true },
      "path": ["hands", 2, "optional"],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        },
        [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      ]
    },
    {
      "action": "leave-object",
      "key": 2,
      "node": { "optional": true },
      "parent": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "path": ["hands", 2],
      "ancestors": [
        {
          "name": "Wilson",
          "optional": true,
          "hands": [
            { "name": "lefty" },
            { "name": "righty", "optional": true },
            { "optional": true }
          ]
        }
      ]
    },
    {
      "action": "leave-array",
      "key": "hands",
      "node": [
        { "name": "lefty" },
        { "name": "righty", "optional": true },
        { "optional": true }
      ],
      "parent": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": ["hands"],
      "ancestors": []
    },
    {
      "action": "leave-object",
      "node": {
        "name": "Wilson",
        "optional": true,
        "hands": [
          { "name": "lefty" },
          { "name": "righty", "optional": true },
          { "optional": true }
        ]
      },
      "path": [],
      "ancestors": []
    }
  ]);
});


test("object visit - field removal - frozen object - on enter", async() => {
  const newObject = await objVisitAsync(Object.freeze({
    name: "Wilson",
    optional: true,
  }), {
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
    },
  });
  expect(newObject).toBeDefined();
  expect(newObject?.optional).not.toBeDefined();
  expect(newObject?.name).toEqual("Wilson");
});
test("object visit - field removal - readonly object - on enter", async() => {

  const obj = Object.defineProperties({}, {
    name: {
      value: "Wilson",
      writable: false,
      enumerable: true,
    },
    optional: {
      value: true,
      writable: false,
      enumerable: true,
    }
  });

  const newObject = await objVisitAsync(obj, {
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
    },
  });
  expect(newObject).toBeDefined();
  expect(newObject?.optional).not.toBeDefined();
  expect(newObject?.name).toEqual("Wilson");
});


test("object visit - field removal - on enter", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: true,
  }, {
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
    },
  });
  expect(newObject).toBeDefined();
  expect(newObject?.optional).not.toBeDefined();
  expect(newObject?.name).toEqual("Wilson");
});

test("object visit - field removal - on leave", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: true,
    child: {
      optional: "maybe",
    },
    arr: [{
      items: 1,
      optional: 2
    }, {
      items: 3
    }]
  }, {
    [OKind.FIELD]: {
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
    },
  });
  
  expect(newObject).toBeDefined();
  expect(newObject?.name).toEqual("Wilson");
  expect(newObject?.optional).not.toBeDefined();
  expect(newObject?.child).toBeDefined();
  expect(newObject?.child?.optional).not.toBeDefined();
  expect(newObject?.arr).toBeDefined();
  expect(newObject?.arr).toHaveLength(2);
  expect(newObject?.arr[0].items).toBe(1);
  expect(newObject?.arr[0].optional).not.toBeDefined()
  expect(newObject?.arr[1].items).toBe(3)
  // expect(newObject).toMatchObject({
  //   name: "Wilson",
  //   child: {},
  //   arr: [{
  //     items: 1,
  //   }, {
  //     items: 3
  //   }]
  // });
});




test("object visit - object removal - on enter", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: {
      "totally": "optional",
    },
    child: {
      optional: {
        "totally": "optional",
      },
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }]
  }, {
    [OKind.OBJECT]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
    },
  });
  expect(newObject).toMatchObject({
    name: "Wilson",
    child: {},
    arr: [{}]
  });
});

test("object visit - object removal - on leave", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: {
      "totally": "optional",
    },
    child: {
      optional: {
        "totally": "optional",
      },
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }]
  }, {
    [OKind.OBJECT]: {
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
    },
  });
  expect(newObject).toMatchObject({
    name: "Wilson",
    child: {},
    arr: [{}]
  });
});


test("object visit - object removal - on leave is not executed", async() => {
  let onLeaveOptional = false;
  let onEnterTotally = false;
  let onLeaveTotally = false;
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: {
      "totally": "optional",
    },
  }, {
    [OKind.FIELD]: {
      enter: async(node, key) => {
        await sleep();
        if(key === "totally") {
          onEnterTotally = true;
        }
        return node;
      },
      leave: async(node, key) => {
        await sleep();
        if(key === "totally") {
          onLeaveTotally = true;
        }
        return node;
      }
    },
    [OKind.OBJECT]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return undefined;
        }
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          onLeaveOptional = true;
        }
        return node;
      },
    },
  });
  expect(onLeaveOptional).toBe(false);
  expect(onEnterTotally).toBe(false);
  expect(onLeaveTotally).toBe(false);
  expect(newObject).toBeDefined();
  expect(newObject?.name).toBe("Wilson");
  expect(newObject?.optional).not.toBeDefined();
});



test("object visit - array removal - on enter", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: {
      "totally": "optional",
    },
    child: {
      optional: {
        "totally": "optional",
      },
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }]
  }, {
    [OKind.ARRAY]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        return undefined;
      },
    },
  });
  expect(newObject).toMatchObject({
    name: "Wilson",
    optional: {
      "totally": "optional",
    },
    child: {
      optional: {
        "totally": "optional",
      },
    },
  });
});

test("object visit - array removal - on leave", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: {
      "totally": "optional",
    },
    child: {
      optional: {
        "totally": "optional",
      },
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }]
  }, {
    [OKind.ARRAY]: {
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        return undefined;
      },
    },
  });
  expect(newObject).toMatchObject({
    name: "Wilson",
    optional: {
      "totally": "optional",
    },
    child: {
      optional: {
        "totally": "optional",
      },
    },
  });
});


test("object visit - on calling break", async() => {
  let leaveCalled = false;
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: true,
    child: {
      optional: {
        "totally": "optional",
      },
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }]
  }, {
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          return BREAK;
        }
        return node;
      },
      leave: async( node, key, parent, path, ancestors) => {
        await sleep();
        if(key === "optional") {
          leaveCalled = true;
        }
      },
    },
  });
  expect(leaveCalled).toBe(false);
});


test("object visit - no changes with null values", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: null,
    child: {
      optional: undefined
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }, null]
  }, { });
  expect(newObject).toMatchObject({
    name: "Wilson",
    optional: null,
    child: {
      optional: undefined
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }, null]
  });
});


test("object visit - changing boolean value on a field", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: null,
    child: {
      optional: true
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }, null]
  }, {
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if (key === "optional") {
          return false;
        }
        return node;
      },
    },
   });
  expect(newObject).toMatchObject({
    name: "Wilson",
    optional: null,
    child: {
      optional: false
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }, null]
  });
});


test("object visit - changing boolean value on a field", async() => {
  const newObject = await objVisitAsync({
    name: "Wilson",
    optional: "something",
    child: {
      optional: true
    },
    arr: [{
      optional: {
        "totally": "optional",
      },
    }]
  }, {
    [OKind.FIELD]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if (key === "optional") {
          return null;
        }
        return node;
      },
    },
    [OKind.OBJECT]: {
      enter: async( node, key, parent, path, ancestors) => {
        await sleep();
        if (key === "optional") {
          return null;
        }
        return node;
      },
    },
   });
  expect(newObject).toMatchObject({
    name: "Wilson",
    optional: null,
    child: {
      optional: null
    },
    arr: [{
      optional: null,
    }]
  });
});