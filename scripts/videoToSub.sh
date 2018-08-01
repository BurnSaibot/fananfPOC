#!/bin/bash
function usage() {
    printf "usage : $0 -f/--format format [options] -i/--input videoFilePath \n"
    printf "available format : srt, webvtt, all \n"
    printf "Other options : \n"
    printf "\t -o/--output outFilePath (existing)(if not specified,outputs will be created in current folder !) \n"
    printf "\t -h/--help help"
}
function rmTmp() {
	echo `rm /tmp/$filename*`
}
function doConversion() {
    echo "Converting into mp4 if needed"
    if [ "$extension" = "mp4" ]
    then
	echo "bon format : pas besoin de convertion"
    else
	echo "mauvais format : conversion en mp4"
	echo `ffmpeg -i $inFile -b:v 4000k /srv/videos/$filename.mp4` 
	echo `rm $inFile`
	echo "conversion to mp4 done"	
    fi
}

function extractingAudio() {
    echo "Extracting audio"
    echo `ffmpeg -i $inFile /tmp/$filename.mp3`
	#echo `ls -lrH /tmp | grp "$filname"`
    echo "created temporary audio file"  
}

function xmlFromVocapia() {
    echo "Getting transcription from vocapia"
    echo `curl -ksS -u cerveau:w4SAuEVL https://rest1.vocapia.com:8093/voxsigma -F method=vrbs_trans -F model=fre -F audiofile=@/tmp/$filename.mp3 > /tmp/$filename.xml`
    #echo `cat /tmp/$filename.xml`
}

function generatingSub() {
    echo "Starting to generate subtiles files"
    inputFile="/tmp/$filename.xml"
    scriptPath=$(dirname $0)
    echo "scriptPath : $scriptPath"
    echo "inputFile : $inputFile"
    script="$scriptPath/xmlToSub/xmlToSub.py"
    echo "Path from py script to execute : $script"
    echo "dollar 1 = $1"
	
    if [ "$1" = "srt" ]
    then
	echo "python $script --srt $inputFile > $folder$filename.srt"
	echo `python $script --srt $inputFile > $folder$filename.srt`
    elif [ "$1" = "vtt" ]
    then
	echo `python $script --webvtt $inputFile > $folder$filename.vtt`
    elif [ "$1" = "all" ]
    then
	echo `python $script  --srt $inputFile > $folder$filename.srt`
	echo `python $script  --webvtt $inputFile > $folders$filename.vtt`
    else
	exit 4
    fi
}
if [ $# -eq 0 ]
then
    usage
    exit 1
fi

getopt --test > /dev/null
if [[ $? -ne 4 ]]; then
    echo "I’m sorry, `getopt --test` failed in this environment."
    exit 1
fi



OPTS=$(getopt --options=f:o:i:h --longoptions=format:,output:,input:,help --name "$0" -- "$@")
if [ $? !=  0 ]
then
    exit 1
fi
echo "$OPTS"
eval set -- "$OPTS"
while true; do
    case "$1" in
        -f|--format)
	    f="y"
	    format="$2"
	    shift 2
	    ;;
        -o|--output)
	    o="y"
            outFile="$2/"
            shift 2
            ;;
	-i|--input)
	    i="y"
            inFile="$2"
	    execPath=$(readlink -f $(dirname $2))
	    file=$(basename -- $inFile)
	    filename="${file%.*}"
	    extension="${file#*.}"
	    #echo "i=$i inflie=$inFile execPath=$execPath file=$file filename=$filename extension=$extension"
            shift 2
            ;;
	-h|--help)
	    usage
	    exit 0
	    shift 2
	    ;;
        --)
            shift
            break
            ;;
        *)
            echo "Programming error"
            exit 3
            ;;
    esac
done

if [ "$o" = "y" ]
then
    folder="$outFile$filename"
else
    #echo "ça sent la douille"
    folder="$filename"
fi

if [ "$f" != "y" ]
then
    echo "il manque un format"
    usage
    exit 1
fi

if [ "$i" != "y" ]
then
    echo "il manque un fichier d'entrée"
    usage
    exit 1
fi

echo "Folder = $Folder"
doConversion
extractingAudio
#echo "$format"
xmlFromVocapia
generatingSub "$format"
rmTpm
exit 0



