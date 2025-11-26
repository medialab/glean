import fs from 'fs';
import path from 'path';

const mediaFolderPath = path.resolve(process.cwd(), 'src/lib/media');
console.log("mediaFolderPath", mediaFolderPath);

const identifyFolders = (folder: string) => {
    const mainFoldersPaths = fs.readdirSync(folder, { withFileTypes: true });

    for (const f of mainFoldersPaths) {
        if (f.name.startsWith('.')) continue;

        if (f.isDirectory()) {
            const subFoldersPaths = fs.readdirSync(path.join(mediaFolderPath, f.name), { withFileTypes: true });
            
            for (const s of subFoldersPaths) {
                if (s.name.startsWith('.')) continue;
                
                if (s.isFile()) {
                    
                    if (fs.existsSync(path.join(folder, f.name, s.name.replace(/\.\w+$/, '.yml')))) {
                        console.log(`File ${s.name} already exists, skipping`);
                        continue;
                    }
                    console.log("Writing file: ", path.join(s.name.replace(/\.\w+$/, '.yml')));
                    fs.writeFileSync(path.join(folder, f.name, s.name.replace(/\.\w+$/, '.yml')), `imgDescription: ""`);
                }
            }
        } else if (f.isFile()) {
            
            if (fs.existsSync(path.join(folder, f.name.replace(/\.\w+$/, '.yml')))) {
                console.log(`File ${f.name} already exists, skipping`);
                continue;
            }
            console.log("Writing file: ", path.join(f.name.replace(/\.\w+$/, '.yml')));
            fs.writeFileSync(path.join(folder, f.name.replace(/\.\w+$/, '.yml')), `imgDescription: ""`);
        }
    }
}

identifyFolders(mediaFolderPath);
