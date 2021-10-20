var express = require("express");
var router = express.Router();
var db = require("../../modules/db-connection");
var sql = require("../../sql");
var checkLoginMiddleWare = require("../../modules/check-login-middleware");
var fileController = require("../../modules/file-controller");
var path = require("path");

// const CODE = process.env.ROOT_CODE; //project path
// Check user for api
router.use(checkLoginMiddleWare.injectUerforAPI);
/**
 * get
 * 사용자 프로젝트 출력
 * @param
 */
router.get("/getcategory", async function (req, res) {
  // const { id } = req.user._user[0];
  try {
    const [rows] = await db.query(sql.problems.getCategoryProblems);
    res.status(200).send({
      result: true,
      data: rows,
      message: "해당하는 유저 프로젝트 리스트",
    });
  } catch (error) {
    console.log(`유저 프로젝트 출력 API 오류 ${error}`);
  }
});

//Get tags tree structure
router.get("/treetags", async function (req, res) {
  try {
    let [level1] = await db.query(sql.problems.selectTagsByTutorialId2, [0]);
    for (let i = 0; i < level1.length; i++) {
      let [level2] = await db.query(sql.problems.selectTagsByTutorialId2, [
        level1[i].id,
      ]);
      level1[i].level2 = level2;
      for (let j = 0; j < level1[i].level2.length; j++) {
        let [level3] = await db.query(sql.problems.selectTagsByTutorialId2, [
          level1[i].level2[j].id,
        ]);
        if (level3.length !== 0) {
          level1[i].level2[j].level3 = level3;
        } else {
          level1[i].level2[j].level3 = [];
          continue;
        }
      }
    }
    res.status(200).send({
      result: true,
      data: level1,
      message: "Tutorisl 리스트",
    });
  } catch (e) {
    console.log(e);
  }
});
//해당하는 Tutorial tag 리스트 출력함, 해당하는 tag 문제 리스트를 출력함
//! 수정필요함
router.get("/category", async function (req, res) {
  try {
    const { id } = req.query;
    let [childCategories] = await db.query(
      sql.problems.selectTagsByTutorialId,
      [id]
    );
    if (childCategories.length === 0) {
      res.status(200).send({
        result: true,
        data: [],
        message: "해당하는 Tutorial tag 리스트",
      });
    } else {
      for (let i = 0; i < childCategories.length; i++) {
        let [problemsbyCategory] = await db.query(
          sql.problems.selectProblemByCategoryId,
          [childCategories[i].id]
        );
        childCategories[i].problems = [];
        childCategories[i].problems.push(problemsbyCategory[0]);
      }
    }
    res.status(200).send({
      result: true,
      data: childCategories,
      message: "해당하는 Tutorial tag 리스트",
    });
  } catch (e) {
    console.log(e);
  }
});
router.get("/getproblemsinfor", async function (req, res) {
  try {
    let [row] = await db.query(sql.problems.getCountProblem);
    const { count } = row[0];
    res.status(200).send({
      result: true,
      data: {
        pbl_count: count,
        pbl_scoring: count,
        pbl_dont: 10,
        language_scroring: 5,
      },
      message: "문제 정보",
    });
  } catch (error) {
    console.log("Get problem info" + error);
  }
});
router.get("/problemsdata", async function (req, res) {
  const { id: userId } = req.user._user[0];
  try {
    let [rows] = await db.query(sql.problems.selectProblems);
    rows = rows.slice(0, 30);
    //!수정 필요함
    // for(let j = 0; j < rows.length; j++)
    // let tempRows = rows.splice(0,23);
    for (let j = 0; j < 30; j++) {
      var { id } = rows[j];
      //해당하는 문제의 테스트 케이스를 출력함
      let [testcases] = await db.query(
        sql.problems.selectTestCaseFromProblemId,
        [id]
      );
      let filterTestCase = testcases.map((testcase) => ({
        input_exp: testcase.input_example,
        output_exp: testcase.output_example,
      }));
      rows[j]["testcases"] = filterTestCase;

      //해당하는 문제는 Category를 출력
      let [row] = await db.query(sql.problems.selectCategoryFromProblemId, [
        id,
      ]);
      let { parent_id } = row[0];
      let [tagRow] = await db.query(sql.problems.getNameTag, [parent_id]);

      row[0]["parent_name"] = tagRow[0].name;
      rows[j]["tagInfo"] = row[0];

      //유저를 좋아하는 문제인제 체크함
      let [problem] = await db.query(sql.problems.checkLikeProblem, [userId,id,1]);
      rows[j]["like"] = problem.length === 1 ? true : false;
    }
    res.status(200).send({
      result: true,
      data: rows,
      message: "전체 문제 리스트",
    });
  } catch (error) {
    console.log("Problems Data" + error);
  }
});
router.get("/", async function (req, res) {
  const { problemId } = req.query;
  try {
    let [rows] = await db.query(sql.problems.selectProblemById, [problemId]);
    if (rows.length > 0) {
      let [testcases] = await db.query(sql.problems.selectTestCaseFromProblemId,[rows[0].id])
      rows[0].testcases = testcases

      let [category] = await db.query(sql.problems.selectCategoryFromProblemId, [rows[0].id])
      let [categoryInfo ] = await db.query(sql.problems.selectCategoryInfoById, [category[0].id])
      
      let categoryModel = {
        child: categoryInfo[0]
      }

      const { parent_id , level} = categoryInfo[0]
      if(level ===  2){
        let [row ] = await db.query(sql.problems.selectCategoryInfoById, [parent_id])
        categoryModel.parent = row[0]
      }else if(level === 3){
        let [row] = await db.query(sql.problems.selectCategoryInfoById, [parent_id])
        categoryModel.parent = row[0]  
        [row] = await db.query(sql.problems.selectCategoryInfoById, [row[0].parent_id])
        categoryModel.grand = row[0]  
      }
      rows[0].category = categoryModel
      res.status(200).send({
        result: true,
        data: rows[0],
        message: "특정한 문제 리스트 입니다",
      });
    } else {
      res.status(200).send({
        result: true,
        data: [],
        message: "해당 문제가 없습니다",
      });
    }
  } catch (e) { }
});

router.get('/multi', async function(req, res) {
  const { problemId } = req.query;
  try {
    let [rows] = await db.query(sql.problems.selectMultiChoiceProblemById, [problemId]);
    if (rows.length > 0) {
      let [answers] = await db.query(sql.problems.selectAnswerByProblemId,[rows[0].id])
      rows[0].answers = answers

      let [category] = await db.query(sql.problems.selectCategoryFromMultiProblemId, [rows[0].id])
      let [categoryInfo ] = await db.query(sql.problems.selectCategoryInfoById, [category[0].id])
      
      let categoryModel = {
        child: categoryInfo[0]
      }

      const { parent_id , level} = categoryInfo[0]
      if(level ===  2){
        let [row ] = await db.query(sql.problems.selectCategoryInfoById, [parent_id])
        categoryModel.parent = row[0]
      }else if(level === 3){
        let [row] = await db.query(sql.problems.selectCategoryInfoById, [parent_id])
        categoryModel.parent = row[0]  
        [row] = await db.query(sql.problems.selectCategoryInfoById, [row[0].parent_id])
        categoryModel.grand = row[0]  
      }
      rows[0].category = categoryModel
      res.status(200).send({
        result: true,
        data: rows[0],
        message: "특정한 문제 리스트 입니다",
      });
    } else {
      res.status(200).send({
        result: true,
        data: [],
        message: "해당 문제가 없습니다",
      });
    }
  } catch (e) {
    console.log(e)
  }
})
router.post("/insertproblem", async function (req, res) {
  try {
    const { title, level, category, content, input, output, testCases} = req.body;
    console.log(title,content,input,output,level);
    if (title && content && input && output) {
      const [problem] = await db.query(sql.selectProblemByNameContent, [ title, content ]);
      if (problem.length != 0) {
        res.status(200).send({
          result: false,
          data: problem,
          message: "이미 같은 문제가 존재합니다.",
        });
      } else {
        let result = await db.query(sql.insertProblem, [ title, content, null, input, output, level]);
        let insertTestCaseQuery;
        try {
          insertTestCaseQuery = sql.insertTestCase(testCases.length);
        } catch (e) {
          console.log(e);
          res.status(400).send({ result: false, message: "잘못된 testcase 입력" });
          return;
        }
        await db.query(
          insertTestCaseQuery,
          testCases.reduce((prev, e) => {
            return prev.concat([e.input_example,e.output_example,result[0].insertId,]);
          }, [])
          );
          await db.query(sql.problems.insertProblemTag,[result[0].insertId, category])
        res.status(200).send({
          result: true,
          data: [],
          message: "문제가 추가되었습니다.",
        });
      }
    } else {
      res.status(200).send({
        result: false,
        data: [],
        message: "입력 정보에 빈 칸이 존재합니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});  



router.put("/problem", async function (req, res) {
  try {
    const {id, title, level, category, content, input, output, testCases} = req.body;
    if (title && content && input && output) {
      let result = await db.query(sql.problems.updateProblem, [ title, content, input, output, level, id]);
      await db.query(sql.problems.deleteTestCaseProblem, [id])
      let insertTestCaseQuery;
      try {
        insertTestCaseQuery = sql.insertTestCase(testCases.length);
      } catch (e) {
        console.log(e);
        res.status(400).send({ result: false, message: "잘못된 testcase 입력" });
        return;
      }
      await db.query(
        insertTestCaseQuery,
        testCases.reduce((prev, e) => {
          return prev.concat([e.input_example,e.output_example,result[0].insertId,]);
        }, [])
      );
      await db.query(sql.problems.insertProblemTag,[result[0].insertId, category])

      res.status(200).send({
        result: true,
        data: [],
        message: "문제 수정 성공했습니다.",
      });
    } else {
      res.status(200).send({
        result: false,
        data: [],
        message: "입력 정보에 빈 칸이 존재합니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});  
router.put("/updateproblem", async function (req, res) {
  try {
    // const {id, title, level, category, content, input, output, testCases} = req.body;
    const {id, title, level, content, input, output, testCases} = req.body;
    if (title && content && input && output && level) {
      let result = await db.query(sql.problems.updateProblem, [ title, content, input, output, level, id]);
      // console.log(result)
       await db.query(sql.problems.deleteTestCaseProblem, [id]);
      //  await db.query(sql.problems.insertTestCase, [id]);
      // await db.query(sql.problems.insertTestCase, [id])
     // let problem_id = { id }
      let insertTestCaseQuery;
      try {
        insertTestCaseQuery = sql.insertTestCase(testCases.length);
      } catch (e) {
        console.log(e);
        res.status(400).send({ result: false, message: "잘못된 testcase 입력" });
        return;
      }
      await db.query(
        insertTestCaseQuery,
        testCases.reduce((prev, e) => {
          return prev.concat([e.input_example,e.output_example,id]);
        // return prev.concat([e.input_example,e.output_example,problem_id]);
        }, [])
      );
          // await db.query(sql.problems.insertProblemTag,[id, category])
        // await db.query(sql.problems.insertProblemTag,[problem_id, category])
        await db.query(sql.problems.insertProblemTag,[id])

      res.status(200).send({
        result: true,
        data: [],
        message: "문제 수정 성공했습니다.",
        // window.location.reload()
      });
    } else {
      res.status(200).send({
        result: false,
        data: [],
        message: "입력 정보에 빈 칸이 존재합니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});  

router.post("/delete-problem", async function (req, res) {
  try {
    const { id } = req.body;
    const [row] = await db.query(sql.problems.selectProblemById,[id])

    if(row.length !== 0){
      await db.query(sql.problems.deleteProblem,[id]);
      await db.query(sql.problems.deleteTestCaseProblem,[id]);
      await db.query(sql.problems.deleteCategoryProblem,[id]);
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 삭제 성공했습니다.",
      });
    }
    else{
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 존재하지 않습니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/delete-shortans", async function (req, res) {
  try {
    const { id } = req.body;
    const [row] = await db.query(sql.problems.selectProblemById,[id])

    if(row.length !== 0){
      await db.query(sql.problems.deleteShortansProblem,[id]);
      await db.query(sql.problems.deleteAnswerShortansProblem,[id]);
      await db.query(sql.problems.deleteShortansCategoryProblem,[id]);
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 삭제 성공했습니다.",
      });
    }
    else{
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 존재하지 않습니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});
router.post("/delete-multiplechoice", async function (req, res) {
  try {
    const { id } = req.body;
    const [row] = await db.query(sql.problems.selectProblemById,[id])

    if(row.length !== 0){
      await db.query(sql.problems.deleteMultiChoiceProblem,[id]);
      await db.query(sql.problems.deleteAnswerMultiChoieProblem,[id]);
      await db.query(sql.problems.deleteMultiChoiceCategoryProblem,[id]);
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 삭제 성공했습니다.",
      });
    }
    else{
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 존재하지 않습니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/insert-multichoice", async function (req, res) {
  try {
    const { level, title, category, content, answer, isAnswer } = req.body;
    if (level && category && content && answer) {
      const [problem] = await db.query(sql.problems.selectMultiChoiceProblem, [ title, content ]);
      if(problem.length !== 0){
        res.status(200).send({
          result: false,
          data: problem,
          message: "이미 같은 문제가 존재합니다.",
        });
      }else{
        let result = await db.query(sql.problems.insertMultiChoiceProblem, [ title , content, level ]);
        let insertAnswerQuery;
        try {
          insertAnswerQuery = sql.insertMultiChoiceAnswer(answer.length);
          console.log(insertAnswerQuery)
        } catch (e) {
          console.log(e);
          res.status(400).send({ result: false, message: "잘못된 answer 입력" });
          return;
        }
        let i = 0;
        await db.query(
          insertAnswerQuery, answer.reduce((prev, e) => {
            i++;
            return prev.concat([e.content, result[0].insertId, isAnswer === i ? "true" : "false"]);
          }, [])
        );

        await db.query(sql.problems.insertMultiChoiceProblemTag,[result[0].insertId, category])  
        res.status(200).send({
          result: true,
          data: [],
          message: "문제가 추가되었습니다.",
        });
      }
    } else {
      res.status(200).send({
        result: false,
        data: [],
        message: "입력 정보에 빈 칸이 존재합니다.",
      });
    }
  } catch (error) {
    console.log(error);
    // helper.failedConnectionServer(res, error);
  }
}); 
//!확인 

  router.put("/update-multichoice", async function (req, res) {
    try {
      const { id, level, title, category, content, answer } = req.body;
      
      if (level && category && content && answer) {
        console.log(title , content, level, id, answer)
        let result = await db.query(sql.problems.updateMultiChoiceProblem, [title , content, level, id]);
        await db.query(sql.problems.deleteAnswerMultiChoieProblem, [id]);
         //await db.query(sql.problems.insertMultiChoiceProblem, [id, title , content, level, answer]);
        let insertAnswerQuery;
        try {
          insertAnswerQuery = sql.insertMultiChoiceAnswer(answer.length);
          console.log(insertAnswerQuery)
        } catch (e) {
          console.log(e);
          res.status(400).send({ result: false, message: "잘못된 answer 입력" });
          return;
        }
        await db.query(
          insertAnswerQuery, 
          answer.reduce((prev, e) => {
            return prev.concat([e.answer_content, e.problem_id]);
          }, [])
        );
        // await db.query(sql.problems.insertMultiChoiceProblemTag,[id])
        res.status(200).send({
          result: true,
          data: [],
          message: "문제가 수정 되었습니다.",
        });
      }
      else{
        res.status(200).send({
          result: false,
          data: [],
          message: "입력 정보에 빈 칸이 존재합니다.",
        });
      }
    } catch (error) {
      console.log(error);
    }
  });  
router.delete("/multichoice-problem", async function (req, res) {
  try {
    const { id } = req.body;
    const [row] = await db.query(sql.problems.selectMultiChoiceProblemById,[id])
    if(row.length !== 0){
      await db.query(sql.problems.deleteMultiChoiceProblem,[id]);
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 삭제 성공했습니다.",
      });
    }
    else{
      res.status(200).send({
        result: true,
        data: [],
        message: "문제가 존재하지 않습니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});


router.post("/insert-short", async function (req, res) {
  try {
    const { level, title, category, content, answer } = req.body;
    if (level && category && content && answer) {
      const [problem] = await db.query(sql.problems.selectShortProblem, [title, content]);
      if (problem.length !== 0) {
        res.status(200).send({
          result: false,
          data: problem,
          message: "이미 같은 문제가 존재합니다.",
        });
      } else {
        let result = await db.query(sql.problems.insertShortProblem, [title, content, level]);
        let insertAnswerQuery;
        try {
          insertAnswerQuery = sql.insertShortAnswer(answer.length);
        } catch (e) {
          console.log(e);
          res.status(400).send({ result: false, message: "잘못된 testcase 입력" });
          return;
        }
        await db.query(
          insertAnswerQuery,
          answer.reduce((prev, e) => {
            return prev.concat([e.content, result[0].insertId, ]);
          }, [])
          );
          await db.query(sql.problems.insertShortProblemTag,[result[0].insertId, category])  
        res.status(200).send({
          result: true,
          data: [],
          message: "문제가 추가되었습니다.",
        });
      }
    } else {
      res.status(200).send({
        result: false,
        data: [],
        message: "입력 정보에 빈 칸이 존재합니다.",
      });
    }
  } catch (error) {
    console.log(error);
    // helper.failedConnectionServer(res, error);
  }
});
//update- short
router.get("/short", async function (req, res) {
  
  const { problemId } = req.query;
  try {
    let [rows] = await db.query(sql.problems.selectShortProblemById, [problemId]);
    if (rows.length > 0) {
      let [answers] = await db.query(sql.problems.selectAnswerByShortansPro,[rows[0].id])
      rows[0].answers = answers

      let [category] = await db.query(sql.problems.selectCategoryFromShortantsProblems, [rows[0].id])
      let [categoryInfo ] = await db.query(sql.problems.selectCategoryInfoById, [category[0].id])
      
      let categoryModel = {
        child: categoryInfo[0]
      }

      const { parent_id , level} = categoryInfo[0]
      if(level ===  2){
        let [row ] = await db.query(sql.problems.selectCategoryInfoById, [parent_id])
        categoryModel.parent = row[0]
      }else if(level === 3){
        let [row] = await db.query(sql.problems.selectCategoryInfoById, [parent_id])
        categoryModel.parent = row[0]  
        [row] = await db.query(sql.problems.selectCategoryInfoById, [row[0].parent_id])
        categoryModel.grand = row[0]  
      }
      rows[0].category = categoryModel
      res.status(200).send({
        result: true,
        data: rows[0],
        message: "특정한 문제 리스트 입니다",
      });
    } else {
      res.status(200).send({
        result: true,
        data: [],
        message: "해당 문제가 없습니다",
      });
    }
  } catch (e) { }
});  

router.put("/update-short", async function (req, res) {
  try {
    const {id, title, level, category, content, answer} = req.body;
    if (title && content && content && answer) {
      let result = await db.query(sql.problems.updateShortansProblem, [ title, content, level, id]);
      await db.query(sql.problems.deleteAnswerShortansProblem, [id]);
      let insertTestCaseQuery;
      try {
        insertTestCaseQuery = sql.insertShortAnswer(answer.length);
      } catch (e) {
        console.log(e);
        res.status(400).send({ result: false, message: "잘못된 testcase 입력" });
        return;
      }
      await db.query(
        insertTestCaseQuery,
        answer.reduce((prev, e) => {
          return prev.concat([e.answer_content, e.problem_id]);
        }, [])
      );
       await db.query(sql.problems.updateShortansProblem,[result[0].insertId, category])

      res.status(200).send({
        result: true,
        data: [],
        message: "문제가 수정되었습니다.",
      });
    } else {
      res.status(200).send({
        result: false,
        data: [],
        message: "입력 정보에 빈 칸이 존재합니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});  


//! 문제 추가
router.put("/shortans-problem", async function (req, res) {
  try {
    const {id, level, title, category, content, answer } = req.body;
    if (level && category && content && answer) {
        let result = await db.query(sql.problems.updateShortansProblem, [title, content, level , id]);
        await db.query(sql.problems.deleteAnswerShortansProblem, [id])
        let insertAnswerQuery;
        try {
          insertAnswerQuery = sql.insertShortAnswer(answer.length);
          console.log(insertAnswerQuery)
        } catch (e) {
          console.log(e);
          res.status(400).send({ result: false, message: "잘못된 answer 입력" });
          return;
        }
        await db.query(
          insertAnswerQuery, answer.reduce((prev, e) => {
            return prev.concat([result[0].insertId, e.content]);
          }, [])
          );
          
        //!update category
        // await db.query(sql.problems.insertShortProblemTag, result[0].insertId, category);

        res.status(200).send({
          result: true,
          data: [],
          message: "문제가 추가되었습니다.",
        });
    } else {
      res.status(200).send({
        result: false,
        data: [],
        message: "입력 정보에 빈 칸이 존재합니다.",
      });
    }
  } catch (error) {
    console.log(error);
    // helper.failedConnectionServer(res, error);
  }
});  
router.delete("/shortans-problem", async function (req, res) {
  try {
    const { id } = req.body;
    const [row] = await db.query(sql.problems.selectShortProblemById,[id])
    if(row.length !== 0){
      await db.query(sql.problems.deleteShortansProblem,[id]);
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 삭제 성공했습니다.",
      });
    }
    else{
      res.status(200).send({
        result: true,
        data: [],
        message: "문제 존재하지 않습니다.",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
