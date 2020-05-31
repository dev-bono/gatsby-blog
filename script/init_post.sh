if [ $# -eq 0 ]
then 
    echo "파일명을 입력해 주세요. 파일명은 md를 제외한 문자열입니다."
    exit 0
fi

FILE_NAME=$1
ROOT_PATH="/Users/bono_macbookpro/Documents/work/blog/gatsby-blog/src/pages"
YEAR_PATH=$ROOT_PATH/$(date +%Y)
MONTH_PATH=$YEAR_PATH/$(date +%m)
DAY_PATH=$MONTH_PATH/$(date +%d)

if [ ! -d $YEAR_PAHT ]
then
    mkdir $YEAR_PAHT
fi
if [ ! -d $MONTH_PATH ]
then
    mkdir $MONTH_PATH
fi
if [ ! -d $DAY_PATH ]
then
    mkdir $DAY_PATH
fi

FILE_PATH=$DAY_PATH/$FILE_NAME.md
touch $FILE_PATH
echo ---$'\n'title: $'\n'date: $(date +%Y-%m-%d) 00:00:00 $'\n'category: $'\n'tags: $'\n'  - $'\n'--- > $FILE_PATH