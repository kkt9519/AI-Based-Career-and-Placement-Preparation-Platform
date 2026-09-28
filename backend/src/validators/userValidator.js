const { z } = require('zod');

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(80).optional(),
  targetRole: z.string().min(2, 'Target role is required').optional(),
  careerGoals: z.string().max(500, 'Career goals cannot exceed 500 characters').optional(),
  skills: z.array(z.string()).optional(),
  profile: z
    .object({
      phone: z.string().max(20).optional(),
      college: z.string().max(120).optional(),
      degree: z.string().max(60).optional(),
      branch: z.string().max(80).optional(),
      graduationYear: z.number().int().min(2000).max(2035).optional(),
      cgpa: z.number().min(0).max(10).optional(),
      bio: z.string().max(500).optional(),
      location: z.string().max(100).optional(),
      githubUrl: z.string().url('Invalid GitHub URL').or(z.literal('')).optional(),
      linkedinUrl: z.string().url('Invalid LinkedIn URL').or(z.literal('')).optional(),
      portfolioUrl: z.string().url('Invalid Portfolio URL').or(z.literal('')).optional(),
    })
    .optional(),
});

module.exports = { updateProfileSchema };
