# Operating Systems (OS)

## Overview

An **Operating System (OS)** is system software that manages computer hardware, software resources, and provides common services for computer programs. It acts as an intermediary between users and the computer hardware.

---

## Core Functions

| Function                  | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| Process Management        | Manages processes, scheduling, and execution           |
| Memory Management         | Handles allocation and deallocation of memory          |
| File System               | Organizes, stores, retrieves, and manages data storage |
| I/O Management            | Manages input/output devices and operations            |
| Security & Access Control | Manages permissions, user authentication               |
| Networking                | Provides networking capabilities and protocols         |
| User Interface            | Command-line (CLI) or graphical user interface (GUI)   |

---

## Process Management

### Processes & Threads

- **Process**: An executing instance of a program.
- **Thread**: The smallest sequence of programmed instructions that can be managed independently.

| Concept           | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| Context Switching | Saving and loading process state during multitasking       |
| Multitasking      | Running multiple processes concurrently                    |
| Multi-threading   | Multiple threads within the same process sharing resources |

### Concurrency vs Parallelism

- **Concurrency**: Multiple tasks progress at overlapping time periods (not necessarily simultaneously).
- **Parallelism**: Multiple tasks execute **simultaneously** on different processors/cores.

---

## Synchronization

Ensures correct sequencing of concurrent operations.

| Mechanism | Description                                                                                        |
| --------- | -------------------------------------------------------------------------------------------------- |
| Mutex     | Mutual exclusion object preventing multiple threads from accessing shared resources simultaneously |
| Semaphore | Controls access to a resource pool with limited capacity                                           |
| Spinlock  | Active waiting for resource availability (low-level)                                               |
| Monitor   | High-level abstraction combining locking and condition variables                                   |

---

## Scheduling Algorithms

Determines the order in which processes are executed.

| Algorithm                     | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| FCFS (First Come First Serve) | Processes executed in order of arrival              |
| SJF (Shortest Job First)      | Shortest processes executed first                   |
| Round Robin                   | Processes executed for a fixed time slice (quantum) |
| Priority Scheduling           | Processes with higher priority executed first       |
| Multilevel Queue              | Separate queues based on priority/class             |

---

## Memory Management

| Concept        | Description                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| Virtual Memory | Uses hardware and software to allow processes to use more memory than physically available |
| Paging         | Divides memory into fixed-size pages and frames                                            |
| Segmentation   | Divides memory into variable-sized segments                                                |
| Swapping       | Moves processes between RAM and disk as needed                                             |

---

## Storage and File Systems

- **File Systems**: NTFS, FAT32, ext4, APFS, etc.
- **Disk Scheduling**: FCFS, SSTF (Shortest Seek Time First), SCAN, C-SCAN.
- **RAID**: Redundant Array of Independent Disks for fault tolerance and performance.

---

## Device Management

Manages device communication through:

| Concept                    | Description                                             |
| -------------------------- | ------------------------------------------------------- |
| Device Drivers             | Interface between OS and hardware devices               |
| Interrupts                 | Signals from devices requesting attention from the CPU  |
| DMA (Direct Memory Access) | Allows devices to access memory without CPU involvement |

---

## Security & Protection

| Feature             | Description                                      |
| ------------------- | ------------------------------------------------ |
| User Authentication | Verifies user identity                           |
| Access Control      | Grants or denies permissions to resources        |
| Encryption          | Protects data privacy and security               |
| Sandboxing          | Isolates processes to limit damage from breaches |

---

## Virtualization

| Concept               | Description                                        |
| --------------------- | -------------------------------------------------- |
| Virtual Machines (VM) | Emulates hardware allowing multiple OS instances   |
| Containers            | Lightweight OS-level virtualization (e.g., Docker) |

---

## Common System Calls

| Operation               | Examples                         |
| ----------------------- | -------------------------------- |
| Process Control         | fork(), exec(), wait(), exit()   |
| File Manipulation       | open(), read(), write(), close() |
| Device Manipulation     | ioctl(), read(), write()         |
| Information Maintenance | getpid(), alarm(), sleep()       |

---

## Popular Operating Systems

| Category | Examples                                         |
| -------- | ------------------------------------------------ |
| Desktop  | Windows, macOS, Linux (Ubuntu, Fedora)           |
| Mobile   | Android, iOS                                     |
| Server   | Windows Server, Red Hat Enterprise Linux, Debian |
| Embedded | FreeRTOS, Embedded Linux                         |

---

## Summary

An Operating System is critical for enabling hardware-software interaction, managing resources, and providing services necessary for application execution. Mastery of OS concepts is fundamental for software development, system design, and performance optimization.
