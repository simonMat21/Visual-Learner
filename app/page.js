"use client";

import { useState } from "react";
import React from "react";
import { useReducer } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  const links = [
    { href: "/page_selectionSort", val: "bubbleSort" },
    { href: "/page_selectionSort", val: "selectionSort" },
    { href: "/page_insertionSort", val: "insertionSort" },
    { href: "/page_mergeSort", val: "mergeSort" },
    { href: "/page_quickSort", val: "quick sort" },
    { href: "/page_binarySearch", val: "binary search" },
    { href: "/page_linkedList", val: "linked List" },
    { href: "/page_doubleLinkedList", val: "Double linked list" },
    { href: "/page_linkedList", val: "Cyclic linked list" },
    { href: "/page_bst", val: "BST" },
    { href: "/page_bst_2", val: "BST 2" },
    { href: "/page_heapSort", val: "heap sort" },
    { href: "/page_heap", val: "heap" },
    { href: "/page_hashTable", val: "hash table" },
    { href: "/page_countSort", val: "count sort" },
  ];
  return (
    <main className="flex flex-col items-center min-h-screen px-4">
      <h1 className="text-6xl font-bold mb-2 mt-20 text-red-600 text-shadow">
        Algo Visualisor
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-10 p-4 m-[100px] max-w-6xl w-full">
        {links.map((item, index) => {
          return (
            <a key={index} href={item.href}>
              <div
                className="container bg-red-600  w-full h-50 shadow-lg rounded-lg hover:cursor-pointer flex flex-col
               items-center transition-transform duration-350 ease-in-out hover:scale-110 justify-end active:scale:100 p-4 text-black"
              >
                {item.val}
              </div>
            </a>
          );
        })}
      </div>
    </main>
  );
}
