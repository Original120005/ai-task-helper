// routes/ai.js — NLP parsing with Hugging Face (English version).
const express = require('express');
const axios = require('axios');
const Task = require('../models/Task');
const router = express.Router();
const HF_TOKEN = process.env.HF_TOKEN;

const { authMiddleware } = require('./tasks');

// POST /parse — parsing text.
router.post('/parse', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    console.log('🧠 NLP parse hit, text:', text);

    // Fallback regex for English (main, stable).
    // TaskName: Everything until first date/time.
    const taskNameMatch = text.match(/^(.+?)(?:\s+(tomorrow|next day|today|at\s*\d+:\d+|on\s*\d+\/\d+\/\d+|\d+:\d+)|$)/i);
    let taskName = taskNameMatch ? taskNameMatch[1].trim() : text.trim() || 'New task';
    // Remove prefixes if any.
    taskName = taskName.replace(/^(add|do|remind|create|go|visit)\s+/i, '').trim();

    // Due: First date/time (including "at 8am").
    let dueDate = text.match(/(tomorrow|next day|today|at\s*\d+:\d+|on\s*\d+\/\d+\/\d+|\d+:\d+)/i)?.[0] || 'no date';

    // Prio: Expanded (urgent/important → high).
    let priority = 'low';
    if (text.match(/(urgent|high|important|critical|urgent!)/i)) priority = 'high';
    else if (text.match(/(normal|medium|med|regular)/i)) priority = 'med';

    console.log('Regex parse: taskName:', taskName, 'due:', dueDate, 'prio:', priority);

    // HF QA as option.
    let useHF = true;
    if (useHF) {
      const payload = JSON.stringify({
        inputs: {
          question: "Extract from the phrase: task: [full name, including action], due: [date/time], prio: [high/med/low from urgent/normal]. Format: task: [name], due: [date], prio: [prio]. Text: ",
          context: text
        }
      });

      const modelUrl = 'https://api-inference.huggingface.co/models/deepset/xlm-roberta-large-squad2';

      const hfResponse = await axios.post(modelUrl, payload, {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json; charset=utf-8',
        },
        transformRequest: [(data) => data],
        timeout: 20000,
        validateStatus: (status) => status < 500,
      });

      if (hfResponse.status === 200) {
        const answer = hfResponse.data[0]?.answer || '';
        const score = hfResponse.data[0]?.score || 0;
        console.log('✅ HF answer:', answer, 'score:', score);

        if (score > 0.1) {  // If HF confident — override.
          const taskMatch = answer.match(/task:\s*(.+?)(?:\s*,\s*due\s*:\s*(.+?)(?:\s*,\s*prio\s*:\s*(.+?))?)?$/i);
          taskName = taskMatch ? taskMatch[1].trim() : taskName;
          dueDate = taskMatch ? taskMatch[2]?.trim() : dueDate;
          priority = taskMatch ? taskMatch[3]?.trim().toLowerCase() : priority;
          console.log('HF override: taskName:', taskName, 'due:', dueDate, 'prio:', priority);
        }
      } else {
        console.error('⚠️ HF error:', hfResponse.status);
      }
    }

    const newTask = new Task({
      text: `${taskName} (due: ${dueDate}, prio: ${priority})`,
      done: false,
      userId: req.user.id
    });
    await newTask.save();

    console.log('📝 NLP task saved:', newTask._id);

    res.status(201).json(newTask);
  } catch (err) {
    console.error('❌ NLP error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Parse failed' });
  }
});

module.exports = router;