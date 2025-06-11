import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Название теста обязательно"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    successMessage: {
      type: String,
      trim: true,
      required: false,
      default: "Поздравляю, вы прошли тест"
    },
    failureMessage: {
      type: String,
      trim: true,
      required: false,
      default: 'К сожалению, вы не прошли тест, попробуйте в следующий раз'
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeLimit: {
      type: Number, // в минутах, 0 - без ограничения
      default: 0,
    },
    manualCheck: {
      type: Boolean,
      default: false,
    },
    passingScore: {
      type: Number, // проходной балл в процентах
      default: 60,
      min: 0,
      max: 100,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    randomOrder: {
      type: Boolean,
      default: false,
    },
    availableFrom: {
      type: Date,
    },
    availableTo: {
      type: Date,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Виртуальное поле для доступа к вопросам теста
testSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "test",
});

// Генерация уникальной ссылки для теста
testSchema.methods.generateShareableLink = function () {
  return `${process.env.CLIENT_URL}/take-test/${this._id}`;
};

const Test = mongoose.model("Test", testSchema);

export default Test;
