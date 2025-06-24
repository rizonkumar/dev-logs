import React from "react";

const technologies = [
  { name: "JavaScript", icon: "devicon-javascript-plain" },
  { name: "React", icon: "devicon-react-original" },
  { name: "Node.js", icon: "devicon-nodejs-plain" },
  { name: "Express", icon: "devicon-express-original" },
  { name: "MongoDB", icon: "devicon-mongodb-plain" },
  { name: "TailwindCSS", icon: "devicon-tailwindcss-plain" },
  { name: "Figma", icon: "devicon-figma-plain" },
  { name: "Git", icon: "devicon-git-plain" },
];

function TechStack() {
  return (
    <div className="bg-gray-800/80 p-6 rounded-2xl border border-gray-700/60 backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-4">My Tech Stack</h3>
      <div className="flex flex-wrap gap-4">
        {technologies.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center bg-gray-700/50 py-2 px-3 rounded-lg"
          >
            <i className={`${tech.icon} text-2xl text-teal-400`}></i>
            <span className="ml-2 text-sm font-medium text-gray-300">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechStack;
