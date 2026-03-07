"use client";

import { useState } from "react";
import { BranchSelector } from "./branch-selector";
import { EnvironmentSelector, type EnvironmentId } from "./environment-selector";

export function EnvironmentBranchBar() {
  const [environment, setEnvironment] = useState<EnvironmentId>("local");
  const [branch, setBranch] = useState("main");

  return (
    <div className="flex items-center justify-between mt-1 px-1 w-full">
      <EnvironmentSelector value={environment} onValueChange={setEnvironment} />
      <BranchSelector value={branch} onValueChange={setBranch} />
    </div>
  );
}
