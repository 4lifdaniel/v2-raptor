import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as applicationService from '../services/applicationService.js';
import { parseExcelFile } from '../services/excelParser.js';
import { CreateApplicationDto } from '../types/application.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', async (_req: Request, res: Response) => {
  try {
    const applications = await applicationService.getAllApplications();
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch applications' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const application = await applicationService.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch application' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const data: CreateApplicationDto = req.body;
    const { application } = await applicationService.upsertApplication(data);
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, error: 'Failed to create application' });
  }
});

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    console.log('Upload request received');
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    console.log('Parsing Excel file...');
    const applications = parseExcelFile(req.file.buffer);
    console.log('Parsed applications:', applications);
    
    if (applications.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid applications found in file' });
    }

    const results = [];
    let createdCount = 0;
    let updatedCount = 0;

    for (const app of applications) {
      const { application, created } = await applicationService.upsertApplication(app);
      results.push(application);
      if (created) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }

    res.status(201).json({ 
      success: true, 
      data: results, 
      count: results.length,
      createdCount,
      updatedCount,
    });
  } catch (error) {
    console.error('Error parsing Excel file:', error);
    res.status(500).json({ success: false, error: (error as Error).message || 'Failed to parse Excel file' });
  }
});

router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const applications: CreateApplicationDto[] = req.body.applications;
    if (!Array.isArray(applications)) {
      return res.status(400).json({ success: false, error: 'Expected array of applications' });
    }
    const results = [];
    let createdCount = 0;
    let updatedCount = 0;

    for (const app of applications) {
      const { application, created } = await applicationService.upsertApplication(app);
      results.push(application);
      if (created) {
        createdCount++;
      } else {
        updatedCount++;
      }
    }

    res.status(201).json({ 
      success: true, 
      data: results, 
      count: results.length,
      createdCount,
      updatedCount,
    });
  } catch (error) {
    console.error('Error creating applications:', error);
    res.status(500).json({ success: false, error: 'Failed to create applications' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data: Partial<CreateApplicationDto> = req.body;
    const application = await applicationService.updateApplication(req.params.id, data);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, error: 'Failed to update application' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await applicationService.deleteApplication(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({ success: true, message: 'Application deleted' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, error: 'Failed to delete application' });
  }
});

router.delete('/', async (_req: Request, res: Response) => {
  try {
    const count = await applicationService.deleteAllApplications();
    res.json({ success: true, message: `Deleted ${count} applications` });
  } catch (error) {
    console.error('Error deleting all applications:', error);
    res.status(500).json({ success: false, error: 'Failed to delete applications' });
  }
});

export default router;
