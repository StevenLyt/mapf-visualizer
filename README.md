[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<div align="center">
  <h1 align="center">MAPF Visualizer</h1>
  <p align="center">A visualization tool for multi-agent path finding algorithms.</p>
  <img src='./src/assets/images/landingpage.png' />
</div>

## About The Project

This project provides a visualization tool for Multi-Agent Path Finding (MAPF) algorithms.

There have been tons of single agent path finding visualization websites, yet they all make use of well-established algorithms such as A star and Dijkstra. However, the field of multi agent path finding is relatively new (CBS, an important MAPF algorithm, was proposed in 2012) and thus didn't gain as much public attention.

This website aims at helping people better understand MAPF by offering a real-time visualization tool. Usually running a MAPF solver involves the following steps:

1. compile the C++ code into executables
2. put the map and instance into two separate files with contents formatted in terms of certain rules
3. run the executable with a complicated command

This website offers a much more intuitive experience. Users will be able to:

1. select a particular algorithm they are interested in
2. design their own map by dragging their mouse to add walls
3. adding agents by entering their start and goal location
4. press the `plan` button and get the animated planning result instantly

### Currently supported MAPF variants and algorithms

#### 1. Classic single-point MAPF

- CBSH2-RTC by Jiaoyang Li.
  This solver consists of Conflict-Based Search (CBS) and many of its improvement techniques, including:
  - Prioritizing conflicts
  - Bypassing conflicts
  - High-level admissible heuristics:
    - CG
    - DG
    - WDG
  - Symmetry reasoning techniques:
    - rectangle reasoning and generalized rectangle reasoning
    - target reasoning
    - corridor reasoning and corridor-target reasoning
    - mutex propagation
  - Disjoint splitting

#### 2. Large agent MAPF

- Multi-Constraint CBS (MC-CBS) by Jiaoyang Li
- Multi-Constraint CBS with Mutex propagation (MC-CBS-M) by Han Zhang, Yutong Li, and Jiaoyang Li

### Built With

This project is bootstrapped with the following frameworks and libraries:

- [React.js](https://reactjs.org/)
- [Express.js](https://expressjs.com)
- [MUI](https://mui.com)

<!-- GETTING STARTED -->

## Getting Started

Open [MAPF Visualizer](http://mapf-visualizer.com) in one of the following browsers for optimal support:

- Chrome v98 and later
- FIrefox v94 or later
- Edge v98 or later
- Safari v15.4 or later (**Note: this requires that you have updated to Mac OS Monterey 12.4, which most people haven't.**)

## Contributing

If you have a MAPF-related algorithm that might fit into the framework of this website, please reach out to me via [email](mailto:yli81711@usc.edu) and I'll be very willing to incorporate it into the website.

## More to implement

- Add pages for more detailed information about MAPF algorithms and corresponding papers.
- Include more MAPF algorithms (CSB-based, SAT-based, etc.) for users to choose which one to run their MAPF instance on.
- Include some other MAPF variants, such as k-robust and lifelong MAPF.
- ...

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

## Contact

For more information about me, please visit my [personal website](https://yutongli.me).

[license-shield]: https://img.shields.io/github/license/stevenlyt/mapf-visualizer?label=license&style=for-the-badge
[license-url]: https://github.com/stevenlyt/mapf-visualizer/blob/master/LICENSE.txt
