<?php
    class Task {
        public $id;
        public $title;
        public $description;
        public $created_at;
        public $updated_at;
        public $done;

        public function __construct($title, $description) {
            $this->title = $title;
            $this->description = $description;
            $this->created_at = date('Y-m-d H:i:s');
            $this->updated_at = date('Y-m-d H:i:s');
            $this->done = 0;
        }
    }
?>