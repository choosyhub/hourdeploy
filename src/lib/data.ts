
'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { GistData } from './types';

// The path to the JSON file, assuming the process runs from the project root
const dataFilePath = path.join(process.cwd(), 'data', 'app_data.json');

async function readData(): Promise<GistData> {
    try {
        await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        // Ensure projects have Date objects
        if (data.projects && Array.isArray(data.projects)) {
            data.projects = data.projects.map((p: any) => ({
                ...p,
                deadline: p.deadline ? new Date(p.deadline) : new Date(),
                createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            }));
        } else {
            data.projects = [];
        }

        return data;
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            // If the file doesn't exist, create it with a default structure
            const defaultData = { logs: [], projects: [], totalHours: 0 };
            await writeData(defaultData);
            return defaultData;
        }
        console.error('Failed to read data file:', error);
        throw new Error('Could not read data from file.');
    }
}

async function writeData(data: GistData): Promise<void> {
    try {
        await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(dataFilePath, jsonString, 'utf-8');
    } catch (error) {
        console.error('Failed to write to data file:', error);
        throw new Error('Could not write data to file.');
    }
}

export { readData, writeData };
