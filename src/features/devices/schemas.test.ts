import { describe, expect, it } from "vitest";

import { isIpv4, newDeviceSchema } from "./schemas";

describe("isIpv4", () => {
  it.each(["0.0.0.0", "192.168.1.1", "10.0.0.1", "255.255.255.255", "8.8.8.8"])(
    "accepts %s",
    (value) => {
      expect(isIpv4(value)).toBe(true);
    },
  );

  it.each([
    ["an out-of-range octet", "256.1.1.1"],
    ["a leading zero", "192.168.01.1"],
    ["too few octets", "1.2.3"],
    ["too many octets", "1.2.3.4.5"],
    ["a trailing dot", "1.2.3."],
    ["letters", "abc.def.ghi.jkl"],
    ["an empty string", ""],
    ["inner whitespace", "192.168. 1.1"],
    ["a CIDR suffix", "192.168.1.1/24"],
  ])("rejects %s", (_reason, value) => {
    expect(isIpv4(value)).toBe(false);
  });
});

describe("newDeviceSchema", () => {
  const valid = { name: "Core-Switch-01", ip: "192.168.1.1", status: "Online" };

  it("accepts a well-formed device", () => {
    expect(newDeviceSchema.safeParse(valid).success).toBe(true);
  });

  it("trims surrounding whitespace from the name and IP", () => {
    const result = newDeviceSchema.parse({
      ...valid,
      name: "  Edge-Router  ",
      ip: "  10.0.0.1  ",
    });

    expect(result).toEqual({
      name: "Edge-Router",
      ip: "10.0.0.1",
      status: "Online",
    });
  });

  it("rejects a name that is only whitespace", () => {
    const result = newDeviceSchema.safeParse({ ...valid, name: "   " });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("Device name is required");
  });

  it("explains what a valid IP address looks like", () => {
    const result = newDeviceSchema.safeParse({ ...valid, ip: "999.1.1.1" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Enter a valid IPv4 address, e.g. 192.168.1.1",
    );
  });

  it("rejects a status outside the known set", () => {
    expect(
      newDeviceSchema.safeParse({ ...valid, status: "Rebooting" }).success,
    ).toBe(false);
  });
});
