import * as DSUtils from "./utils";

test("nest", () => {
  const result = DSUtils.nest({
    "profile.firstName": "test",
    "profile.lastName": "test2",
  });

  expect(result).toEqual({
    profile: {
      firstName: "test",
      lastName: "test2",
    },
  });
});

test("nest empty", () => {
  const result = DSUtils.nest([]);

  expect(result).toEqual({});
});

test("nest value false", () => {
  const result = DSUtils.nest([
    { key: "reason", value: "revoked" },
    { key: "suppress_revoke_notification_email", value: false },
  ]);

  expect(result).toEqual({
    reason: "revoked",
    suppress_revoke_notification_email: false,
  });
});

test("deep merge", () => {
  const a = {
    a: {
      b: {
        c: "testc",
        f: {
          g: "testg",
        },
      },
    },
  };

  const b = {
    a: {
      b: {
        e: "teste",
      },
      d: "testd",
    },
  };

  expect(DSUtils.deepMerge(a, b)).toEqual({
    a: {
      b: {
        c: "testc",
        f: {
          g: "testg",
        },
        e: "teste",
      },
      d: "testd",
    },
  });
});

test("deep merge 2", () => {
  const data = {
    data: [],
  };

  const metadata = {
    metadata: {
      count: 0,
      current_page: 1,
      total_count: 0,
      total_pages: 1,
      per: 50,
      previous_page_url: null,
      next_page_url: null,
    },
  };

  expect(DSUtils.deepMerge(data, metadata)).toEqual({
    data: [],
    metadata: {
      count: 0,
      current_page: 1,
      total_count: 0,
      total_pages: 1,
      per: 50,
      previous_page_url: null,
      next_page_url: null,
    },
  });
});

test("linearize", () => {
  const data = {
    profile: {
      firstName: "test",
      lastName: "test2",
    },
    email: "test@test",
  };

  const result = DSUtils.linearize(data);

  const output = [
    { key: "profile.firstName", value: "test" },
    { key: "profile.lastName", value: "test2" },
    { key: "email", value: "test@test" },
  ];

  expect(result).toEqual(output);
});

test("isempty", () => {
  const b = { a: "sdf" };

  expect(DSUtils.isEmpty(b)).toEqual(false);
  expect(DSUtils.isEmpty({})).toEqual(true);
  expect(DSUtils.isEmpty(undefined)).toEqual(true);
  expect(DSUtils.isEmpty([])).toEqual(false);
});
