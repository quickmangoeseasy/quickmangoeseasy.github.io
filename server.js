const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());

function loadPackages() {
    return JSON.parse(fs.readFileSync("packages.json", "utf8"));
}

function savePackages(packages) {
    fs.writeFileSync("packages.json", JSON.stringify(packages, null, 2));
}

app.get("/", (req, res) => {
    res.send("MangoBase server is running!");
});

app.post("/package", (req, res) => {
    const packages = loadPackages();

    const newPackage = {
        id: "MB-" + Date.now(),
        origin: req.body.origin,
        destination: req.body.destination,
        status: "CREATED"
    };

    packages.push(newPackage);
    savePackages(packages);

    res.json(newPackage);
});

app.get("/package/:id", (req, res) => {
    const packages = loadPackages();

    const packageData = packages.find(pkg => pkg.id === req.params.id);

    if (!packageData) {
        return res.status(404).json({
            error: "Package not found"
        });
    }

    res.json(packageData);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`MangoBase server running on port ${PORT}`);
});