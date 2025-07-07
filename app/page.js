"use client";

import { useState } from "react";
import React from "react";
import { useReducer } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const linkers = [
    {
      title: "Sorting",
      links: [
        { href: "/page_bubbleSort", val: "bubbleSort" },
        { href: "/page_selectionSort", val: "selectionSort" },
        { href: "/page_insertionSort", val: "insertionSort" },
        { href: "/page_mergeSort", val: "mergeSort" },
        { href: "/page_quickSort", val: "quick sort" },
        { href: "/page_heapSort", val: "heap sort" },
        { href: "/page_countSort", val: "count sort" },
      ],
    },
    {
      title: "Search",
      links: [
        { href: "/page_binarySearch", val: "binary search" },
        { href: "/page_bst", val: "BST" },
        { href: "/page_bst_2", val: "BST 2" },
      ],
    },
    {
      title: "Linked List",
      links: [
        { href: "/page_linkedList", val: "linked List" },
        { href: "/page_doubleLinkedList", val: "Double linked list" },
        { href: "/page_linkedList", val: "Cyclic linked list" },
      ],
    },
    {
      title: "Misc",
      links: [
        { href: "/page_heap", val: "heap" },
        { href: "/page_hashTable", val: "hash table" },
        { href: "/page_countSort", val: "count sort" },
        { href: "/page_linearProbing", val: "Linear Probing" },
        { href: "/page_quadraticProbing", val: "Quadratic Probing" },
      ],
    },
  ];
  //  backdrop-blur-[1px] bg-white/10 -->ADD this for glass effect siree.
  return (
    <main className="main">
      <h1 className="heading tshad">Algo Visualisor</h1>

      {linkers.map((item, index) => {
        return (
          <div key={index} className="flex flex-col align-center mt-12">
            <h1 className="titleval tshad">{item.title}</h1>
            <div className="flex w-200  p-4 rounded-3xl">
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 p-4 m[25px] max-w-6xl w-full">
                {item.links.map((val, index) => {
                  return (
                    <a href={val.href} key={index}>
                      <div
                        className="container bg-[#ff4a4a] shadow-[4px_4px_8px_rgba(255,74,74,0.8)]  w-full h-50 rounded-lg hover:cursor-pointer flex flex-col
               items-center transition-transform duration-350 ease-in-out hover:scale-110 justify-end active:scale:100 p-4 text-black"
                      >
                        {val.val}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
