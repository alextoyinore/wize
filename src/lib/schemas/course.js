const courseSchema = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  instructor: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  image: { type: String, required: true },
  lessons: [{
    title: String,
    description: String,
    videoUrl: String,
    duration: String,
    order: Number
  }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}

export default courseSchema
