[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
<img src='./src/asset/mapf-demo.gif' width="200" height="200"/>

  <h3 align="center">MAPF Visualizer</h3>

  <p align="center">
    A visualization tool for multi-agent path finding algorithms
    <br />
</div>

## About The Project

This project provides a visualization tool for Multi-Agent Path Finding (MAPF) algorithms.

There have been tons of single agent path finding visualization websites, yet they all make use of well-established algorithms such as A star and Dijkstra. However, the field of multi agent path finding is relatively new (CBS, an important MAPF algorithm, was proposed in 2012) and thus didn't gain as much public attention. 

This website aims at helping people better understand MAPF **by** offering a real-time visualization tool. Usually running a MAPF solver involves the following steps:
1. compile the C++ code into executables 
2. put the map and instance into two separate files with contents formatted in terms of certain rules
3. run the executable with a complicated command
   
This website offers a much more intuitive experience. Users will be able to:
1. select a particular algorithm they are interested in
2. design their own map by dragging their mouse to add walls
3. adding agents by entering their start and goal location
4. press the `plan` button and get the animated planning result instantly

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

- [React.js](https://reactjs.org/)
- [Express.js](https://expressjs.com)
- [MUI](https://mui.com)

<!-- GETTING STARTED -->

## Getting Started

Open [MAPF Visualizer](http://mapf-visualizer.com) in Chrome v98 and later for optimal support.

## Contributing

If you have a MAPF-related algorithm that might fit into the framework of this website, please reach out to me via [email](yli81711@usc.edu) and I'll be very willing to incorporate it into the website.

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
