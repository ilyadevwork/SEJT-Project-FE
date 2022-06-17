import create, { useStore } from "zustand";

interface configState {
  catagory: string;
  setCatagory: (str: string) => void;
  isAggregate: boolean;
  setAggregation: (val: boolean) => void;
  selectedTech: string[];
  updateSelectedTech: (entry: string[]) => void;
  branchLoadedItems: [
    {
      name: string;
      location: number;
    }
  ];
  pushBranchLoadedItems: (entry: string) => void;
}

export const stateStore = create<configState>((set) => ({
  catagory: "Technologies",
  setCatagory: (str) => set((state) => ({ catagory: str })),
  isAggregate: true,
  setAggregation: (val) => set((state) => ({ isAggregate: val })),
  selectedTech: [],
  updateSelectedTech: (entry) => set((state) => ({ selectedTech: entry })),
  branchLoadedItems: [
    {
      name: "",
      location: 0,
    },
  ],
  pushBranchLoadedItems: (entry) => set((state) => ({branchLoadedItems: [...state.branchLoadedItems, ]}))
}));
